module.exports=function(_dom){
	"use strict";
	if(_dom.has('dom-splitter'))return;
	const {Listener}=require('@dom-for-node/tools/src/core/Listener');
	/**
	Component 'dom-splitter'.
	@param {'auto'|0|1} direction : split direction 0=x 1=y
	*/
	_dom.model('dom-splitter',function(tagName,direction='auto'){
		let doms={};
		let handler=new DomSplitterModel(this,doms).init(direction);
		return doms.root;
		
	},{
		'.dom-splitter':{
			position	:"relative",
			width	:"100%",
			height	:"100%",
			"&>._ds-container"	:{
				position	:"absolute",
				width	:"100%",
				height	:"100%",
				"&>*"	:{
					position	:"absolute",
					minHeight:'1px',
					minWidth:'1px',
					overflow:'hidden',
				},
				"&>.button"	:{
					backgroundColor:'#888'
				},
				"&>._ds-container"	:{
				},
				"&>._ds-containerA"	:{
				},
				"&>._ds-containerB"	:{
				}
			}
		}
	},false);

	/**
	Component 'dom-splitter' model handler.
	@constructor
	*/
	class DomSplitterModel{
		constructor(scope,doms){
			this.tagName='dom-splitter';
			this.scope=scope;
			this.doms=doms;
			this.enabled=true;
			this.thickness=5;
			this.dir=-1;
			this.size=[0,0];
			this.sizes=[1,1];
			this.csizes=[[1,1],[1,1]];
			this.padding=[50,50];
			this.listener=new Listener();
		}
		get freeSpace(){
			return this.size[this.dir]-this.thickness;
		}
		init(direction){
			this.direction	= direction;
			
			this.initDom();
			this.initIo();
			this.initEvents();
			Object.defineProperty(this.doms.root,'doms',{get:()=>this.doms});
			
			return this;
		}
		initDom(){
			let doms=this.doms;
			doms.containerA	= _dom('div',{className:"_ds-container _ds-containerA"});
			doms.button	= _dom('div',{className:"button"});
			doms.containerB	= _dom('div',{className:"_ds-container _ds-containerB"});
			doms.main	= _dom('div',{className:"_ds-container"},[
				doms.containerA,
				doms.button,
				doms.containerB
			]);
			doms.root	= _dom('div',{className:"dom-splitter"},[
				doms.main
			]);
		}
		initIo(){
			Object.defineProperties(this.doms.root,{
				/** @attr {'auto'|0|1} split direction 0=x 1=y
				 'auto'=the biggest direction */
				direction:{
					get:()=>this.direction,
					set:v=>{
						if([0,1,'auto'].includes(v)){
							this.direction=v
							this.resize(this.size);
						}
					},
				},
				/** @attr {[[number,number],[number,number]]} readonly containers sizes [[c0.width,c0.height],[c1.width,c1.height]] */
				sizes:{
					get:()=>this.csizes
				},
				containers:{
					get:()=>[this.doms.containerA,this.doms.containerB]
				},
				freeSpace:{
					get:()=>this.freeSpace
				},
				enabled:{
					get:()=>this.enabled,
					set:v=>this.enabled=!!v
				},
				disabled:{
					get:()=>!this.enabled,
					set:v=>this.enabled=!v
				},
				value:{
					get:()=>this.sizes[0],
					set:v=>this.doms.root.perc=v/this.freeSpace,
				},
				perc:{
					get:()=>this.sizes[0]/this.freeSpace,
					set:v=>{
						let smb=this.freeSpace;
						this.sizes[0]=smb*Math.max(0,Math.min(1,v));
						this.sizes[1]=smb-this.sizes[0];
					}
				},
			});
			['on','resize'].forEach(k=>{
				this.doms.root[k]=(...args)=>this[k](...args);
			});
		}
		initEvents(){
			let doms=this.doms;
			let down=0;
			doms.button.addEventListener('mousedown',evt=>{
				down=[evt.pageX,evt.pageY];
				
			});
			doms.root.addEventListener('mousemove',evt=>{
				if(down&&this.enabled){
					let xy=[evt.pageX,evt.pageY];
					// let sperc=this.sizes[0]/(this.sizes[0]+this.sizes[1]);
					// let smb=size[dir]-this.thickness;
					let delta=xy[this.dir]-down[this.dir];
					if(delta!==0){
						let smb=this.freeSpace;
						this.sizes[0]=Math.max(1,Math.min(smb-1,this.sizes[0]+delta));
						this.sizes[1]=smb-this.sizes[0];
						this.updateSizes();
					}
					//this.updateSizes();
					down=xy;
				}
				// this.dir
			});
			window.addEventListener('mouseup',evt=>{
				down=0;
			});
			new ResizeObserver(entries=>{
				let rect=this.doms.root.getBoundingClientRect();
				let size=[rect.width,rect.height];
				this.resize(size);
			}).observe(this.doms.root)
		}
		// -----------------
		on(type,callback){
			console.log('on',type,callback);
			this.listener.add(type,callback);
			return this.doms.root;
		}
		resize(size){
			let dir=this.direction==='auto'?(size[0]>size[1]?0:1):this.direction;

			this.doms.button.style.cursor=(dir?'row':'col')+'-resize';

			let sperc=this.sizes[0]/(this.sizes[0]+this.sizes[1]);
			let smb=size[dir]-this.thickness;

			this.sizes=[smb*sperc,smb*(1-sperc)];
			
			this.dir=dir;
			this.size=size;

			this.updateSizes();
			// console.log('-resize',this.listener);
			this.listener.flush('resize',[this.csizes]);
		}
		updateSizes(){
			let doms=this.doms;
			let elts=['containerA','button','containerB'];
			let smb=this.freeSpace;
			// console.log('sizesa',this.sizes.slice(0));
			if(this.padding[0]+this.padding[1]<smb){
				if(this.padding[0]>this.sizes[0]){
					this.sizes[0]=this.padding[0];
					this.sizes[1]=smb-this.sizes[0];
				}else if(this.padding[1]>this.sizes[1]){
					this.sizes[1]=this.padding[1];
					this.sizes[0]=smb-this.sizes[1];
				}
			}else{
				if(this.sizes[0]<1){
					this.sizes[0]=1;
					this.sizes[1]=smb-this.sizes[0];
				}
				if(this.sizes[1]<1){
					this.sizes[1]=1;
					this.sizes[0]=smb-this.sizes[1];
				}				
			}
			//this.csizes=[[1,1],[1,1]];
			this.csizes=this.sizes.map((s,i)=>this.dir?
				[this.size[0],this.sizes[i]]:
				[this.sizes[i],this.size[1]]
			);

			let sizes=[this.sizes[0],this.thickness,this.sizes[1]];
			let pos=[0,this.sizes[0],this.sizes[0]+this.thickness];
			// console.log('this.csizes',this.csizes);
			elts.forEach((k,i)=>{
				doms[k].style.width=this.dir?'100%':sizes[i]+'px';
				doms[k].style.height=!this.dir?'100%':sizes[i]+'px';
				doms[k].style.left=this.dir?'0px':pos[i]+'px';
				doms[k].style.top=!this.dir?'0px':pos[i]+'px';
			});

			this.listener.flush('update',[this.csizes]);
		}
		
	};
};