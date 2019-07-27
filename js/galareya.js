class Filter{
	/**
		* constructor.
		* @param  {Object} data - parameters.
	*/
	constructor(data={}) {
		this.selector = data.selector;
		if(data.column)
			this.n = data.column;
		else
			this.n = 6;
		this.totalHeight = {};
		if(data.duration)
			this.default_duration=data.duration;
		else
			this.default_duration=1000;
		this.duration = this.default_duration;
		this.func = this.linear;
	}
	getWidtht (){
		return 100/this.n;
	}
	getDiv(){
		let main_div = document.querySelectorAll(this.selector);
		return  main_div[0].children;
	}
	resize(){			
		this.duration=-1;
		this.build();	
	}

	build(){
		return new Promise((resolve, reject) => {
			 resolve(this.setMainStyle()); 
		}).then(
			() => {
				this.setPosition();								  
			}
		  );
					  
	}
	setMainStyle(){
		let width = this.getWidtht();
		let div = this.getDiv();
		for(let i=0;  i<div.length; i++) {
			div[i].style.padding = '.0em';
			div[i].style.position = 'absolute';
			div[i].style.width = width+'%';
		}
	}
	unsetHidden(div){
		/*let new_div = [];
		for(let i=0;  i<div.length; i++) {
			if(div[i].style.display !='none'){
				new_div.push(div[i]);
			}
		}
		return new_div;*/
		return div;
	}
	setPosition(){
		let width = this.getWidtht();
		let div = this.unsetHidden(this.getDiv());
		let min = Infinity;
		let min_j = 0;
		let moveParams = {};
		for (let j=0; j<this.n ; j++){
			this.totalHeight[j] = 0;
		}
		
		for(let i=0;  i<div.length; i++) {
			for(let j=0;  j<this.n; j++) {
				if(this.totalHeight[j]<min){
					min_j = j;
					min = this.totalHeight[min_j];
				}		
			}
				this.totalHeight[min_j] = this.totalHeight[min_j] + div[i].children[0].clientHeight;
				min = this.totalHeight[min_j];
				
				moveParams[i]={};
				moveParams[i]['div']=div[i];
				moveParams[i]['left']=this.getWidtht()*min_j+'%';
				moveParams[i]['top']=this.totalHeight[min_j]-div[i].children[0].clientHeight +'px';
				
				moveParams[i]['div'].style.top = Math.floor(Math.random() * Math.floor(400))+'px';
				moveParams[i]['div'].style.left = Math.floor(Math.random() * Math.floor(100))+'%';

		}
		
		this.setGalleryHeight();
		this.move(moveParams);
	}
	move(data){

		let new_data = {};
		for(let i in data) {
			if(data[i]['div'].style.top != data[i]['top'] || data[i]['div'].style.left != data[i]['left']){
				new_data[i]	= {};
				new_data[i]['div']	= data[i]['div'];
				new_data[i]['top']	= data[i]['top'];
				new_data[i]['left']	= data[i]['left'];
				new_data[i]['top_old']	= (data[i]['div'].style.top?data[i]['div'].style.top:0);
				new_data[i]['left_old']	= (data[i]['div'].style.left?data[i]['div'].style.left:0);	
			}		
		}

		let start = performance.now();
		let animate = (time)=>{
			var timePassed = time - start;
			if (timePassed > this.duration){
				timePassed = this.duration;	
			} 
			this.drow(timePassed, new_data);
			if (timePassed < this.duration) {
				requestAnimationFrame(animate);
			}

		};
		requestAnimationFrame(animate)


	}
	drow(timePassed, data){
		let coefficient = this.func(timePassed/this.duration);
		for(let i in data) {
			let top = parseInt(data[i]['top_old']) + (parseInt(data[i]['top']) - parseInt(data[i]['top_old'])) * coefficient ;
			let left = parseFloat(data[i]['left_old']) +(parseFloat(data[i]['left']) - parseFloat(data[i]['left_old'])) * coefficient;
			data[i]['div'].style.top = top+'px';
			data[i]['div'].style.left = left+'%';

		}
	}

	linear(param){
		return param;
	}
	/*back(param){console.log(param);
		let x = 1;
		return Math.pow(param, 2) * ((x + 1) * param - x);
	}
	elastic(param) {
		return 1 - Math.sin(Math.acos(param))
	}*/



	setGalleryHeight(){
		let max=0;
		for(let j=0;  j<this.n; j++) {
			if(this.totalHeight[j]>max){
				max = this.totalHeight[j]
			}		
		}
		document.querySelectorAll(this.selector)[0].style.height = max+'px';
	}
	filter(filter=''){
		this.duration = this.default_duration;
		let div = this.getDiv();
		for(let i=0;  i<div.length; i++) {
				let str = div[i].getAttribute('data-filter');
				
				let display = false;
				if(str && filter!=''){
					let arr = str.split(' ');
					for(let j=0; j<arr.length; j++){
						if(arr[j] == filter) display = true;
					}	
				}
				if(filter=='') display = true;
				if(display)
					div[i].style.display='';
				else	
					div[i].style.display='none';
		}
		this.setPosition();	
	
	}	
}

class Gallery{
	/**
		* constructor.
		* @param  {Object} data - parameters.
	*/
	constructor(data={}) {
		this.selector = data.selector;
		this.images = {};
		this.images_n = 0;
		if(data.duration)
			this.default_duration=data.duration;
		else
			this.default_duration=500;
		this.duration = this.default_duration;
	}

	getDiv(){
		let main_div = document.querySelectorAll(this.selector);
		return  main_div[0].children;
	}
	unsetHidden(div){
		let new_div = [];
		for(let i=0;  i<div.length; i++) {
			if(div[i].style.display !='none'){
				new_div.push(div[i]);
			}
		}
		return new_div;
	}
	getImages(){
		this.images_n=0;
		let image = {};
		let div = this.unsetHidden(this.getDiv());
		for(let i=0;  i<div.length; i++) {
			if(div[i].getElementsByTagName('img')[0].getAttribute('data-full'))
				image[i] = div[i].getElementsByTagName('img')[0].getAttribute('data-full');
			else
				image[i] = div[i].getElementsByTagName('img')[0].getAttribute('src');
			this.images_n++;
		}

		return image;
	}
	openImage(e){
		var src ='';
		if(e.path[0].getAttribute('data-full'))
			src = e.path[0].getAttribute('data-full');
		else
			src = e.path[0].getAttribute('src');
		
		for(let i in this.images)	{
			if(this.images[i]==src){
				this.setNumberImage(i);
				break;
			}
		}
		this.buildGallery();
	}
	setNumberImage(i){
		let n = parseInt(i);
		this.n = n;
		this.previous = n-1;
		if(n < this.images_n-1){
			this.next = n+1;
		} 
		else{
			this.next = 0;	
		}
		if(this.next == 1) this.previous = this.images_n-1;
	}
	buildGallery(){
		let div = document.createElement('div');
		div.setAttribute('class', 'gallery');
		this.div_id = 'gallery_div';
		div.setAttribute('id', this.div_id);
		div.style.height = window.innerHeight+'px';
		div.style.top = window.pageYOffset+'px';

		let close = document.createElement('div');
		close.setAttribute('id', 'gallery_close');
		close.innerHTML = 'Close';

		
		this.getImage().then(
			img => {
				div.appendChild(img);
			}
		  );
		
		div.appendChild(close);
		
		document.body.appendChild(div);

		document.body.style.overflow='hidden';
		document.getElementById('gallery_div').addEventListener("click", galleryClick);
		document.getElementById('gallery_close').addEventListener("click", this.destroyGallery);
		
	}
	destroyGallery(){
		document.getElementById('gallery_div').remove();
		document.body.style.overflow='';
	}
	resizeWindow(){
		this.duration = -1;
		this.changeImage(this.n);
	}
	getImage(){
		return new Promise((resolve, reject) => {
			let img = document.createElement('img');
			img.setAttribute('src', this.images[this.n]);
			img.onload = ()=>{
				let height = 0;
				let width = 0;

				let top = 0;
				let left = 0;

				let imgHeight = img.naturalHeight;
				let imgWidth = img.naturalWidth;
				
				let windowHeight = window.innerHeight;
				let windowWidth = window.innerWidth;
				var coecoefficient = 1;

				if(windowHeight/imgHeight < windowWidth/imgWidth){
					coecoefficient = windowHeight/imgHeight;
				}else{
					coecoefficient = windowWidth/imgWidth;
				}
				if(coecoefficient<1){
					height = coecoefficient * imgHeight;
					width = coecoefficient * imgWidth;
				}else{
					height = imgHeight;
					width = imgWidth;
				}

				if(height>0){
					img.style.height = height+'px';
					img.style.top = (windowHeight - height)/2 +'px';
				} 
				if(width>0){
					img.style.width = width+'px';
					img.style.left = (windowWidth - width)/2 +'px';
				} 

				resolve(img);
			};
		});
	}
	
	galleryClick(e){
		let x = e.clientX;
		if (window.innerWidth/2 < x) this.changeImage(this.next);
		else this.changeImage(this.previous);
	}
	changeImage(i){
		
		this.setNumberImage(i);
		let start = performance.now();
		let div = document.getElementById(this.div_id);
		
		this.getImage().then(
			img => {
				div.appendChild(img);
			}
		 ).then(()=>{
				let animate = (time)=>{	
					var timePassed = time - start;
					if (timePassed > this.duration) timePassed = this.duration;	
					this.drow(timePassed,  this.duration);
					if (timePassed < this.duration) {
						requestAnimationFrame(animate);
					}
					else{
						div.removeChild(div.querySelectorAll('img')[0]);
					} 
				};
				requestAnimationFrame(animate);
			}
		);
		
		
	}
	drow(timePassed){

		let div = document.getElementById(this.div_id);
		let img =div.querySelectorAll('img');
		let coefficient = this.linear(timePassed/this.duration);
			let opacity_0 = 1 - coefficient;
			let opacity_1 = 0 + coefficient;
				img[0].style.opacity = opacity_0;	
				img[1].style.opacity = opacity_1;
	}
	linear(param){
		return param;
	}


	gallery(){
		this.images = this.getImages();
	}
}




function galleryInit(){
					
	gallery.gallery();
	let div = gallery.getDiv();
	for(let i=0; i< div.length; i++){
		div[i].getElementsByTagName('img')[0].addEventListener("click", imageClick);
	}


	var target = document.querySelector(gallery.selector);
	var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		gallery.gallery();
	});    
	});
	
	var config = { attributes: true, childList: true, characterData: true };
	
	observer.observe(target, config);

	
	let filter = document.querySelectorAll('.filter_btn');
	for(let i=0; i<filter.length; i++) filter[i].addEventListener("click", filterf);
	function filterf(e){
		let filter = e.path[0].getAttribute('data-filter');
		gallery_filter.filter(filter);
	}
	
	
	gallery_filter.build();
	gallery_filter.setPosition();

}
function imageClick(e){
	gallery.openImage(e);
}
function galleryClick(e){
	gallery.galleryClick(e);
}


window.onresize = function(event) {
	gallery_filter.resize();
	gallery.resizeWindow();
};
