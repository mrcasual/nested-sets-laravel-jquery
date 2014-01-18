<?php namespace MRC\Model;

use Eloquent, DB;

class Category extends \Kalnoy\Nestedset\Node {

    protected $table = "mrc_category";
    protected $fillable = array('title');

}