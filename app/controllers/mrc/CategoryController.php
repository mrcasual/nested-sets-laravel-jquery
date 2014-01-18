<?php namespace MRC;

use Request, BaseController, View, Input, App, DB;
use MRC\Model\Category;

class CategoryController extends BaseController {

	public function __construct()
	{
		// filter to validate POST requests
		$this->beforeFilter(function()
		{
			$this->request = (object) Input::all();
			if ( ! Request::ajax() ||
				 ! in_array($this->request->action, ["addCategory", "deleteCategory", "renameCategory", "moveCategory"]) ||
				 (\Validator::make(['name' => $this->request->name], ["name" => ["required", "regex:/^[\w\p{Cyrillic}\040,.-_']+$/u"]])->fails())
			) App::abort(405);

	    }, ["on" => "post"]);
	}

	public function getIndex()
	{
		$categories = Category::withoutRoot()->get(['id', 'title as label', '_lft', '_rgt', 'parent_id'])->toTree();
		return View::make("mrc.category")->with("categoriesData", $categories);
	}

	public function postIndex()
    {
    	// start transaction
    	DB::beginTransaction();

    	switch($this->request->action) {

			case "renameCategory":
				$status = Category::where("title", $this->request->originalname)
 								  ->where("id", $this->request->id)
 								  ->update(["title" => $this->request->name]);
				break;

			case "addCategory":
				$sourceCategory = new Category(['title' => $this->request->name]);
				$targetCategory = Category::root();

				// append category to root
				if ( $status = $sourceCategory->appendTo($targetCategory)->save() ) {
					DB::commit();
					return ["id" => $sourceCategory->id, "parent_id" => $sourceCategory->parent_id];
				}
				break;

			case "deleteCategory":
				try {
					$category = Category::where("title", $this->request->name)
									    ->where("id", $this->request->id)
										->firstOrFail();
					$status = $category->delete();
				} catch (\Exception $e) {
					$status = false;
				}
				break;

			case "moveCategory":
				// get source/target categories from DB
				$sourceCategory = Category::find($this->request->id);
				$targetCategory = Category::find($this->request->to);

				// check for data consistency (can also do a try&catch instead)
				if ($sourceCategory && $targetCategory && ($sourceCategory->parent_id == $this->request->parent_id)) {
					switch ($this->request->direction) {
						case "inside" :
							$status = $sourceCategory->prependTo($targetCategory)->save();
							break;
						case "before" :
							$status = $sourceCategory->before($targetCategory)->save();
							break;
						case "after" :
							$status = $sourceCategory->after($targetCategory)->save();
							break;
					}
				}
				break;
	   	}
    	if (!isset($status) || $status == null) { DB::rollback(); App::abort(400); }
    	DB::commit();
    }

}