$(function () {

    // configure spinner
    $spinner = $(".loading");
	$spinner.toggle();
	
    // configure editable
    $.fn.editableform.buttons = '<button type="submit" class="editable-submit">OK</button>'
                              + '<button type="button" class="editable-cancel">Cancel</button>'
                              + '<button type="button" class="editable-delete">Delete</button>';
    $.fn.editable.defaults.mode = 'inline';
	
    // configure tree
    var $tree = $("#tree");
    var opts = {
        data: data,
        dragAndDrop: true,
        autoOpen: true,
        selectable: false,
        useContextMenu: false,
        onCreateLi: function (node, $li) {
            var li = $li.find(".jqtree-title");
            li
                .attr("data-pk", node.id)
                .attr("data-type", "text")
            .addClass("editable-click editable-container")
                .attr("data-name", node.name)
        }
    }
	function checkData() { if ($tree.find("ul").children().length === 0) $tree.html("Empty :)"); }
	$tree.bind("tree.init", checkData)
	
	// initialize tree
    $tree.tree(opts)

    // move category
    $tree.bind("tree.move", function (e) {
        $spinner.toggle();
        e.preventDefault();
        $.ajax(serverUrl, {
            type: "POST",
            data: {
                "action": "moveCategory",
                "id": e.move_info.moved_node.id,
                "parent_id": e.move_info.moved_node.parent_id,
                "to": e.move_info.target_node.id,
                "name": e.move_info.moved_node.name,
                "direction": e.move_info.position
            },
            success: function () {
               $spinner.toggle();
                e.move_info.do_move();
                e.move_info.moved_node["parent_id"] = (e.move_info.position == "inside") ? e.move_info.target_node["id"] : e.move_info.target_node["parent_id"];
            },
            error: function (r) {
                $spinner.toggle();
                alertify.error(r.statusText);
            }
        });
    }) // END move

    // add category
    $(".newCategory").click(function (e) {
        e.preventDefault();
        alertify.prompt("Category name:", function (e, str) {
            if (e) {
                $spinner.toggle();
                $.ajax(serverUrl, {
                    type: "POST",
                    data: {
                        "action": "addCategory",
                        "name": str
                    },
                    success: function (r) {
                        $spinner.toggle();
                        var root = $tree.tree("getTree");
                        $tree.tree(
                            "appendNode", {
                                name: str,
                                id: r.id,
                                parent_id: r.parent_id
                            },
                            root
                        );
                    },
                    error: function (r) {
                        $spinner.toggle();
                        alertify.error(r.statusText);
                    }
                });
            }
        });
    }) // END add

    // rename category
    $tree.editable({
        selector: "span.jqtree-title",
        url: serverUrl,
        params: function (params) {
            var data = {};
            data.action = "renameCategory";
            data.id = params.pk;
            data.name = params.value;
            data.originalname = params.name;
            return data;
        },
        success: function (r, v) {
            var node = $tree.tree("getNodeById", $(this).attr("data-pk"));
            node.name = v;
            $(this).editable("option", "name", v)
        },
        error: function (r) {
            alertify.error(r.statusText);
        }
    }) // END rename

    // delete category
    $(document).on("click", ".editable-delete", function () {
        var nodeId = $(this).closest(".jqtree-element").find("span:eq(0)").data("pk");
        var node = $tree.tree("getNodeById", nodeId)
		alertify.set({ buttonFocus: "cancel", buttonReverse: true }); 
        alertify.confirm("Are you sure you want to delete this category?", function (e) {
            if (e) {
                $spinner.toggle();
                $.ajax(serverUrl, {
                    type: "POST",
                    data: {
                        "action": "deleteCategory",
                        "id": node.id,
                        "name": node.name
                    },
                    success: function (d) {
                        $spinner.toggle();
                        $tree.tree("removeNode", node);
						checkData();
                    },
                    error: function (r) {
                        $spinner.toggle();
                        alertify.error(r.statusText);
                    }
                });
            }
        });
    }); // END delete

});