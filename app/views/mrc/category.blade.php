<!DOCTYPE html>
<html id="home" lang="en">

<head>
    <meta charset=utf-8 />
    <link rel="stylesheet" href="/assets/site.min.css">
</head>

<body>
     <div class="loading">
        <div class="spinner">
            <div class="mask">
                <div class="maskedCircle"></div>
            </div>
        </div>
    </div>
    <div id="tree"></div>
    <a href="#" class="newCategory">Add new category</a>
    <script type="text/javascript">
        var data = {{ $categoriesData }};
        var serverUrl = "{{ Request::url() }}";
        function run() {
            var a = document.createElement("script");
            a.src ="/assets/site.min.js", document.body.appendChild(a)
        }
        window.addEventListener ? window.addEventListener("load", run, !1) : window.attachEvent ? window.attachEvent("onload", run) : window.onload = run;
    </script>
</body>

</html>
