# dom-splitter
 
Component 'dom-splitter'.
 
<hr/>
 
## <a name='main_menu'></a> Menu
+ [dom-splitter](#dom-splitter)
+ [DomSplitterModel](#DomSplitterModel)
	+ [domSplitterModel.direction](#direction)
	+ [domSplitterModel.sizes](#sizes)
 
<hr/>
 
<hr/>
 
## <a name="dom-splitter"></a> model **dom-splitter**
 
Component 'dom-splitter'.
 
**use** : _dom( **'dom-splitter'** , **direction** )
 
 + **param** : direction `'auto'|0|1`

&emsp; split direction 0=x 1=y
 
 
[▲](#main_menu)
<hr/>
 
<hr/>
 
## <a name="DomSplitterModel"></a> class **DomSplitterModel**
 
Component 'dom-splitter' model handler.
 
**use** : new DomSplitterModel()
 
<hr/>
 
+ ### <a name="direction"></a> attr **direction**
&emsp;&emsp; split direction 0=x 1=y

&emsp;&emsp; 'auto'=the biggest direction

&emsp;&emsp; **use** : domSplitterModel.direction `'auto'|0|1`
<hr/>
 
+ ### <a name="sizes"></a> attr **sizes**

&emsp;&emsp; readOnly

&emsp;&emsp; containers sizes [[c0.width,c0.height],[c1.width,c1.height]]

&emsp;&emsp; **use** : domSplitterModel.sizes `[[number,number],[number,number]]`
 
[▲](#main_menu)
<hr/>
 