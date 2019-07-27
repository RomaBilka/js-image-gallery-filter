# JS image galereya filter

---
```
<div id='gallery'>
	<div id="grid">
		<div data-filter="Glass"><img src="img/01_small.jpg" alt="" data-full="img/01.jpg"></div>
		<div data-filter="Nature"><img src="img/02_small.jpg" alt="" data-full="img/02.jpg"></div>
		<div data-filter="Nature"><img src="img/03_small.jpg" alt="" data-full="img/03.jpg"></div>				
	</div>
</div>
```

```
<script>
	const gallery = new Gallery({selector:'#grid', duration:500});
	const gallery_filter = new Filter({selector:'#grid', column:4, duration:1000 });
	window.onload = function() {
		galleryInit();	
	}
</script>
```
