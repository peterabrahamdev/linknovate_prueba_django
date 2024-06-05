;(function(){var undefined;var VERSION='4.17.14';var FUNC_ERROR_TEXT='Expected a function';var COMPARE_PARTIAL_FLAG=1,COMPARE_UNORDERED_FLAG=2;var WRAP_BIND_FLAG=1,WRAP_PARTIAL_FLAG=32;var INFINITY=1/0,MAX_SAFE_INTEGER=9007199254740991;var argsTag='[object Arguments]',arrayTag='[object Array]',asyncTag='[object AsyncFunction]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',genTag='[object GeneratorFunction]',numberTag='[object Number]',objectTag='[object Object]',proxyTag='[object Proxy]',regexpTag='[object RegExp]',stringTag='[object String]';var reUnescapedHtml=/[&<>"']/g,reHasUnescapedHtml=RegExp(reUnescapedHtml.source);var reIsUint=/^(?:0|[1-9]\d*)$/;var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};var freeGlobal=typeof global=='object'&&global&&global.Object===Object&&global;var freeSelf=typeof self=='object'&&self&&self.Object===Object&&self;var root=freeGlobal||freeSelf||Function('return this')();var freeExports=typeof exports=='object'&&exports&&!exports.nodeType&&exports;var freeModule=freeExports&&typeof module=='object'&&module&&!module.nodeType&&module;function arrayPush(array,values){array.push.apply(array,values);return array;}
function baseFindIndex(array,predicate,fromIndex,fromRight){var length=array.length,index=fromIndex+(fromRight?1:-1);while((fromRight?index--:++index<length)){if(predicate(array[index],index,array)){return index;}}
return-1;}
function baseProperty(key){return function(object){return object==null?undefined:object[key];};}
function basePropertyOf(object){return function(key){return object==null?undefined:object[key];};}
function baseReduce(collection,iteratee,accumulator,initAccum,eachFunc){eachFunc(collection,function(value,index,collection){accumulator=initAccum?(initAccum=false,value):iteratee(accumulator,value,index,collection);});return accumulator;}
function baseValues(object,props){return baseMap(props,function(key){return object[key];});}
var escapeHtmlChar=basePropertyOf(htmlEscapes);function overArg(func,transform){return function(arg){return func(transform(arg));};}
var arrayProto=Array.prototype,objectProto=Object.prototype;var hasOwnProperty=objectProto.hasOwnProperty;var idCounter=0;var nativeObjectToString=objectProto.toString;var oldDash=root._;var objectCreate=Object.create,propertyIsEnumerable=objectProto.propertyIsEnumerable;var nativeIsFinite=root.isFinite,nativeKeys=overArg(Object.keys,Object),nativeMax=Math.max;function lodash(value){return value instanceof LodashWrapper?value:new LodashWrapper(value);}
var baseCreate=(function(){function object(){}
return function(proto){if(!isObject(proto)){return{};}
if(objectCreate){return objectCreate(proto);}
object.prototype=proto;var result=new object;object.prototype=undefined;return result;};}());function LodashWrapper(value,chainAll){this.__wrapped__=value;this.__actions__=[];this.__chain__=!!chainAll;}
LodashWrapper.prototype=baseCreate(lodash.prototype);LodashWrapper.prototype.constructor=LodashWrapper;function assignValue(object,key,value){var objValue=object[key];if(!(hasOwnProperty.call(object,key)&&eq(objValue,value))||(value===undefined&&!(key in object))){baseAssignValue(object,key,value);}}
function baseAssignValue(object,key,value){object[key]=value;}
function baseDelay(func,wait,args){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
return setTimeout(function(){func.apply(undefined,args);},wait);}
var baseEach=createBaseEach(baseForOwn);function baseEvery(collection,predicate){var result=true;baseEach(collection,function(value,index,collection){result=!!predicate(value,index,collection);return result;});return result;}
function baseExtremum(array,iteratee,comparator){var index=-1,length=array.length;while(++index<length){var value=array[index],current=iteratee(value);if(current!=null&&(computed===undefined?(current===current&&!false):comparator(current,computed))){var computed=current,result=value;}}
return result;}
function baseFilter(collection,predicate){var result=[];baseEach(collection,function(value,index,collection){if(predicate(value,index,collection)){result.push(value);}});return result;}
function baseFlatten(array,depth,predicate,isStrict,result){var index=-1,length=array.length;predicate||(predicate=isFlattenable);result||(result=[]);while(++index<length){var value=array[index];if(depth>0&&predicate(value)){if(depth>1){baseFlatten(value,depth-1,predicate,isStrict,result);}else{arrayPush(result,value);}}else if(!isStrict){result[result.length]=value;}}
return result;}
var baseFor=createBaseFor();function baseForOwn(object,iteratee){return object&&baseFor(object,iteratee,keys);}
function baseFunctions(object,props){return baseFilter(props,function(key){return isFunction(object[key]);});}
function baseGetTag(value){return objectToString(value);}
function baseGt(value,other){return value>other;}
var baseIsArguments=noop;function baseIsDate(value){return isObjectLike(value)&&baseGetTag(value)==dateTag;}
function baseIsEqual(value,other,bitmask,customizer,stack){if(value===other){return true;}
if(value==null||other==null||(!isObjectLike(value)&&!isObjectLike(other))){return value!==value&&other!==other;}
return baseIsEqualDeep(value,other,bitmask,customizer,baseIsEqual,stack);}
function baseIsEqualDeep(object,other,bitmask,customizer,equalFunc,stack){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=objIsArr?arrayTag:baseGetTag(object),othTag=othIsArr?arrayTag:baseGetTag(other);objTag=objTag==argsTag?objectTag:objTag;othTag=othTag==argsTag?objectTag:othTag;var objIsObj=objTag==objectTag,othIsObj=othTag==objectTag,isSameTag=objTag==othTag;stack||(stack=[]);var objStack=find(stack,function(entry){return entry[0]==object;});var othStack=find(stack,function(entry){return entry[0]==other;});if(objStack&&othStack){return objStack[1]==other;}
stack.push([object,other]);stack.push([other,object]);if(isSameTag&&!objIsObj){var result=(objIsArr)?equalArrays(object,other,bitmask,customizer,equalFunc,stack):equalByTag(object,other,objTag,bitmask,customizer,equalFunc,stack);stack.pop();return result;}
if(!(bitmask&COMPARE_PARTIAL_FLAG)){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,'__wrapped__'),othIsWrapped=othIsObj&&hasOwnProperty.call(other,'__wrapped__');if(objIsWrapped||othIsWrapped){var objUnwrapped=objIsWrapped?object.value():object,othUnwrapped=othIsWrapped?other.value():other;var result=equalFunc(objUnwrapped,othUnwrapped,bitmask,customizer,stack);stack.pop();return result;}}
if(!isSameTag){return false;}
var result=equalObjects(object,other,bitmask,customizer,equalFunc,stack);stack.pop();return result;}
function baseIsRegExp(value){return isObjectLike(value)&&baseGetTag(value)==regexpTag;}
function baseIteratee(func){if(typeof func=='function'){return func;}
if(func==null){return identity;}
return(typeof func=='object'?baseMatches:baseProperty)(func);}
function baseLt(value,other){return value<other;}
function baseMap(collection,iteratee){var index=-1,result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value,key,collection){result[++index]=iteratee(value,key,collection);});return result;}
function baseMatches(source){var props=nativeKeys(source);return function(object){var length=props.length;if(object==null){return!length;}
object=Object(object);while(length--){var key=props[length];if(!(key in object&&baseIsEqual(source[key],object[key],COMPARE_PARTIAL_FLAG|COMPARE_UNORDERED_FLAG))){return false;}}
return true;};}
function basePick(object,props){object=Object(object);return reduce(props,function(result,key){if(key in object){result[key]=object[key];}
return result;},{});}
function baseRest(func,start){return setToString(overRest(func,start,identity),func+'');}
function baseSlice(array,start,end){var index=-1,length=array.length;if(start<0){start=-start>length?0:(length+start);}
end=end>length?length:end;if(end<0){end+=length;}
length=start>end?0:((end-start)>>>0);start>>>=0;var result=Array(length);while(++index<length){result[index]=array[index+start];}
return result;}
function copyArray(source){return baseSlice(source,0,source.length);}
function baseSome(collection,predicate){var result;baseEach(collection,function(value,index,collection){result=predicate(value,index,collection);return!result;});return!!result;}
function baseWrapperValue(value,actions){var result=value;return reduce(actions,function(result,action){return action.func.apply(action.thisArg,arrayPush([result],action.args));},result);}
function compareAscending(value,other){if(value!==other){var valIsDefined=value!==undefined,valIsNull=value===null,valIsReflexive=value===value,valIsSymbol=false;var othIsDefined=other!==undefined,othIsNull=other===null,othIsReflexive=other===other,othIsSymbol=false;if((!othIsNull&&!othIsSymbol&&!valIsSymbol&&value>other)||(valIsSymbol&&othIsDefined&&othIsReflexive&&!othIsNull&&!othIsSymbol)||(valIsNull&&othIsDefined&&othIsReflexive)||(!valIsDefined&&othIsReflexive)||!valIsReflexive){return 1;}
if((!valIsNull&&!valIsSymbol&&!othIsSymbol&&value<other)||(othIsSymbol&&valIsDefined&&valIsReflexive&&!valIsNull&&!valIsSymbol)||(othIsNull&&valIsDefined&&valIsReflexive)||(!othIsDefined&&valIsReflexive)||!othIsReflexive){return-1;}}
return 0;}
function copyObject(source,props,object,customizer){var isNew=!object;object||(object={});var index=-1,length=props.length;while(++index<length){var key=props[index];var newValue=customizer?customizer(object[key],source[key],key,object,source):undefined;if(newValue===undefined){newValue=source[key];}
if(isNew){baseAssignValue(object,key,newValue);}else{assignValue(object,key,newValue);}}
return object;}
function createAssigner(assigner){return baseRest(function(object,sources){var index=-1,length=sources.length,customizer=length>1?sources[length-1]:undefined;customizer=(assigner.length>3&&typeof customizer=='function')?(length--,customizer):undefined;object=Object(object);while(++index<length){var source=sources[index];if(source){assigner(object,source,index,customizer);}}
return object;});}
function createBaseEach(eachFunc,fromRight){return function(collection,iteratee){if(collection==null){return collection;}
if(!isArrayLike(collection)){return eachFunc(collection,iteratee);}
var length=collection.length,index=fromRight?length:-1,iterable=Object(collection);while((fromRight?index--:++index<length)){if(iteratee(iterable[index],index,iterable)===false){break;}}
return collection;};}
function createBaseFor(fromRight){return function(object,iteratee,keysFunc){var index=-1,iterable=Object(object),props=keysFunc(object),length=props.length;while(length--){var key=props[fromRight?length:++index];if(iteratee(iterable[key],key,iterable)===false){break;}}
return object;};}
function createCtor(Ctor){return function(){var args=arguments;var thisBinding=baseCreate(Ctor.prototype),result=Ctor.apply(thisBinding,args);return isObject(result)?result:thisBinding;};}
function createFind(findIndexFunc){return function(collection,predicate,fromIndex){var iterable=Object(collection);if(!isArrayLike(collection)){var iteratee=baseIteratee(predicate,3);collection=keys(collection);predicate=function(key){return iteratee(iterable[key],key,iterable);};}
var index=findIndexFunc(collection,predicate,fromIndex);return index>-1?iterable[iteratee?collection[index]:index]:undefined;};}
function createPartial(func,bitmask,thisArg,partials){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
var isBind=bitmask&WRAP_BIND_FLAG,Ctor=createCtor(func);function wrapper(){var argsIndex=-1,argsLength=arguments.length,leftIndex=-1,leftLength=partials.length,args=Array(leftLength+argsLength),fn=(this&&this!==root&&this instanceof wrapper)?Ctor:func;while(++leftIndex<leftLength){args[leftIndex]=partials[leftIndex];}
while(argsLength--){args[leftIndex++]=arguments[++argsIndex];}
return fn.apply(isBind?thisArg:this,args);}
return wrapper;}
function equalArrays(array,other,bitmask,customizer,equalFunc,stack){var isPartial=bitmask&COMPARE_PARTIAL_FLAG,arrLength=array.length,othLength=other.length;if(arrLength!=othLength&&!(isPartial&&othLength>arrLength)){return false;}
var index=-1,result=true,seen=(bitmask&COMPARE_UNORDERED_FLAG)?[]:undefined;while(++index<arrLength){var arrValue=array[index],othValue=other[index];var compared;if(compared!==undefined){if(compared){continue;}
result=false;break;}
if(seen){if(!baseSome(other,function(othValue,othIndex){if(!indexOf(seen,othIndex)&&(arrValue===othValue||equalFunc(arrValue,othValue,bitmask,customizer,stack))){return seen.push(othIndex);}})){result=false;break;}}else if(!(arrValue===othValue||equalFunc(arrValue,othValue,bitmask,customizer,stack))){result=false;break;}}
return result;}
function equalByTag(object,other,tag,bitmask,customizer,equalFunc,stack){switch(tag){case boolTag:case dateTag:case numberTag:return eq(+object,+other);case errorTag:return object.name==other.name&&object.message==other.message;case regexpTag:case stringTag:return object==(other+'');}
return false;}
function equalObjects(object,other,bitmask,customizer,equalFunc,stack){var isPartial=bitmask&COMPARE_PARTIAL_FLAG,objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!=othLength&&!isPartial){return false;}
var index=objLength;while(index--){var key=objProps[index];if(!(isPartial?key in other:hasOwnProperty.call(other,key))){return false;}}
var result=true;var skipCtor=isPartial;while(++index<objLength){key=objProps[index];var objValue=object[key],othValue=other[key];var compared;if(!(compared===undefined?(objValue===othValue||equalFunc(objValue,othValue,bitmask,customizer,stack)):compared)){result=false;break;}
skipCtor||(skipCtor=key=='constructor');}
if(result&&!skipCtor){var objCtor=object.constructor,othCtor=other.constructor;if(objCtor!=othCtor&&('constructor'in object&&'constructor'in other)&&!(typeof objCtor=='function'&&objCtor instanceof objCtor&&typeof othCtor=='function'&&othCtor instanceof othCtor)){result=false;}}
return result;}
function flatRest(func){return setToString(overRest(func,undefined,flatten),func+'');}
function isFlattenable(value){return isArray(value)||isArguments(value);}
function isIndex(value,length){var type=typeof value;length=length==null?MAX_SAFE_INTEGER:length;return!!length&&(type=='number'||(type!='symbol'&&reIsUint.test(value)))&&(value>-1&&value%1==0&&value<length);}
function isIterateeCall(value,index,object){if(!isObject(object)){return false;}
var type=typeof index;if(type=='number'?(isArrayLike(object)&&isIndex(index,object.length)):(type=='string'&&index in object)){return eq(object[index],value);}
return false;}
function nativeKeysIn(object){var result=[];if(object!=null){for(var key in Object(object)){result.push(key);}}
return result;}
function objectToString(value){return nativeObjectToString.call(value);}
function overRest(func,start,transform){start=nativeMax(start===undefined?(func.length-1):start,0);return function(){var args=arguments,index=-1,length=nativeMax(args.length-start,0),array=Array(length);while(++index<length){array[index]=args[start+index];}
index=-1;var otherArgs=Array(start+1);while(++index<start){otherArgs[index]=args[index];}
otherArgs[start]=transform(array);return func.apply(this,otherArgs);};}
var setToString=identity;function compact(array){return baseFilter(array,Boolean);}
function concat(){var length=arguments.length;if(!length){return[];}
var args=Array(length-1),array=arguments[0],index=length;while(index--){args[index-1]=arguments[index];}
return arrayPush(isArray(array)?copyArray(array):[array],baseFlatten(args,1));}
function findIndex(array,predicate,fromIndex){var length=array==null?0:array.length;if(!length){return-1;}
var index=fromIndex==null?0:toInteger(fromIndex);if(index<0){index=nativeMax(length+index,0);}
return baseFindIndex(array,baseIteratee(predicate,3),index);}
function flatten(array){var length=array==null?0:array.length;return length?baseFlatten(array,1):[];}
function flattenDeep(array){var length=array==null?0:array.length;return length?baseFlatten(array,INFINITY):[];}
function head(array){return(array&&array.length)?array[0]:undefined;}
function indexOf(array,value,fromIndex){var length=array==null?0:array.length;if(typeof fromIndex=='number'){fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex;}else{fromIndex=0;}
var index=(fromIndex||0)-1,isReflexive=value===value;while(++index<length){var other=array[index];if((isReflexive?other===value:other!==other)){return index;}}
return-1;}
function last(array){var length=array==null?0:array.length;return length?array[length-1]:undefined;}
function slice(array,start,end){var length=array==null?0:array.length;start=start==null?0:+start;end=end===undefined?length:+end;return length?baseSlice(array,start,end):[];}
function chain(value){var result=lodash(value);result.__chain__=true;return result;}
function tap(value,interceptor){interceptor(value);return value;}
function thru(value,interceptor){return interceptor(value);}
function wrapperChain(){return chain(this);}
function wrapperValue(){return baseWrapperValue(this.__wrapped__,this.__actions__);}
function every(collection,predicate,guard){predicate=guard?undefined:predicate;return baseEvery(collection,baseIteratee(predicate));}
function filter(collection,predicate){return baseFilter(collection,baseIteratee(predicate));}
var find=createFind(findIndex);function forEach(collection,iteratee){return baseEach(collection,baseIteratee(iteratee));}
function map(collection,iteratee){return baseMap(collection,baseIteratee(iteratee));}
function reduce(collection,iteratee,accumulator){return baseReduce(collection,baseIteratee(iteratee),accumulator,arguments.length<3,baseEach);}
function size(collection){if(collection==null){return 0;}
collection=isArrayLike(collection)?collection:nativeKeys(collection);return collection.length;}
function some(collection,predicate,guard){predicate=guard?undefined:predicate;return baseSome(collection,baseIteratee(predicate));}
function sortBy(collection,iteratee){var index=0;iteratee=baseIteratee(iteratee);return baseMap(baseMap(collection,function(value,key,collection){return{'value':value,'index':index++,'criteria':iteratee(value,key,collection)};}).sort(function(object,other){return compareAscending(object.criteria,other.criteria)||(object.index-other.index);}),baseProperty('value'));}
function before(n,func){var result;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
n=toInteger(n);return function(){if(--n>0){result=func.apply(this,arguments);}
if(n<=1){func=undefined;}
return result;};}
var bind=baseRest(function(func,thisArg,partials){return createPartial(func,WRAP_BIND_FLAG|WRAP_PARTIAL_FLAG,thisArg,partials);});var defer=baseRest(function(func,args){return baseDelay(func,1,args);});var delay=baseRest(function(func,wait,args){return baseDelay(func,toNumber(wait)||0,args);});function negate(predicate){if(typeof predicate!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
return function(){var args=arguments;return!predicate.apply(this,args);};}
function once(func){return before(2,func);}
function clone(value){if(!isObject(value)){return value;}
return isArray(value)?copyArray(value):copyObject(value,nativeKeys(value));}
function eq(value,other){return value===other||(value!==value&&other!==other);}
var isArguments=baseIsArguments(function(){return arguments;}())?baseIsArguments:function(value){return isObjectLike(value)&&hasOwnProperty.call(value,'callee')&&!propertyIsEnumerable.call(value,'callee');};var isArray=Array.isArray;function isArrayLike(value){return value!=null&&isLength(value.length)&&!isFunction(value);}
function isBoolean(value){return value===true||value===false||(isObjectLike(value)&&baseGetTag(value)==boolTag);}
var isDate=baseIsDate;function isEmpty(value){if(isArrayLike(value)&&(isArray(value)||isString(value)||isFunction(value.splice)||isArguments(value))){return!value.length;}
return!nativeKeys(value).length;}
function isEqual(value,other){return baseIsEqual(value,other);}
function isFinite(value){return typeof value=='number'&&nativeIsFinite(value);}
function isFunction(value){if(!isObject(value)){return false;}
var tag=baseGetTag(value);return tag==funcTag||tag==genTag||tag==asyncTag||tag==proxyTag;}
function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;}
function isObject(value){var type=typeof value;return value!=null&&(type=='object'||type=='function');}
function isObjectLike(value){return value!=null&&typeof value=='object';}
function isNaN(value){return isNumber(value)&&value!=+value;}
function isNull(value){return value===null;}
function isNumber(value){return typeof value=='number'||(isObjectLike(value)&&baseGetTag(value)==numberTag);}
var isRegExp=baseIsRegExp;function isString(value){return typeof value=='string'||(!isArray(value)&&isObjectLike(value)&&baseGetTag(value)==stringTag);}
function isUndefined(value){return value===undefined;}
function toArray(value){if(!isArrayLike(value)){return values(value);}
return value.length?copyArray(value):[];}
var toInteger=Number;var toNumber=Number;function toString(value){if(typeof value=='string'){return value;}
return value==null?'':(value+'');}
var assign=createAssigner(function(object,source){copyObject(source,nativeKeys(source),object);});var assignIn=createAssigner(function(object,source){copyObject(source,nativeKeysIn(source),object);});function create(prototype,properties){var result=baseCreate(prototype);return properties==null?result:assign(result,properties);}
var defaults=baseRest(function(object,sources){object=Object(object);var index=-1;var length=sources.length;var guard=length>2?sources[2]:undefined;if(guard&&isIterateeCall(sources[0],sources[1],guard)){length=1;}
while(++index<length){var source=sources[index];var props=keysIn(source);var propsIndex=-1;var propsLength=props.length;while(++propsIndex<propsLength){var key=props[propsIndex];var value=object[key];if(value===undefined||(eq(value,objectProto[key])&&!hasOwnProperty.call(object,key))){object[key]=source[key];}}}
return object;});function has(object,path){return object!=null&&hasOwnProperty.call(object,path);}
var keys=nativeKeys;var keysIn=nativeKeysIn;var pick=flatRest(function(object,paths){return object==null?{}:basePick(object,paths);});function result(object,path,defaultValue){var value=object==null?undefined:object[path];if(value===undefined){value=defaultValue;}
return isFunction(value)?value.call(object):value;}
function values(object){return object==null?[]:baseValues(object,keys(object));}
function escape(string){string=toString(string);return(string&&reHasUnescapedHtml.test(string))?string.replace(reUnescapedHtml,escapeHtmlChar):string;}
function identity(value){return value;}
var iteratee=baseIteratee;function matches(source){return baseMatches(assign({},source));}
function mixin(object,source,options){var props=keys(source),methodNames=baseFunctions(source,props);if(options==null&&!(isObject(source)&&(methodNames.length||!props.length))){options=source;source=object;object=this;methodNames=baseFunctions(source,keys(source));}
var chain=!(isObject(options)&&'chain'in options)||!!options.chain,isFunc=isFunction(object);baseEach(methodNames,function(methodName){var func=source[methodName];object[methodName]=func;if(isFunc){object.prototype[methodName]=function(){var chainAll=this.__chain__;if(chain||chainAll){var result=object(this.__wrapped__),actions=result.__actions__=copyArray(this.__actions__);actions.push({'func':func,'args':arguments,'thisArg':object});result.__chain__=chainAll;return result;}
return func.apply(object,arrayPush([this.value()],arguments));};}});return object;}
function noConflict(){if(root._===this){root._=oldDash;}
return this;}
function noop(){}
function uniqueId(prefix){var id=++idCounter;return toString(prefix)+id;}
function max(array){return(array&&array.length)?baseExtremum(array,identity,baseGt):undefined;}
function min(array){return(array&&array.length)?baseExtremum(array,identity,baseLt):undefined;}
lodash.assignIn=assignIn;lodash.before=before;lodash.bind=bind;lodash.chain=chain;lodash.compact=compact;lodash.concat=concat;lodash.create=create;lodash.defaults=defaults;lodash.defer=defer;lodash.delay=delay;lodash.filter=filter;lodash.flatten=flatten;lodash.flattenDeep=flattenDeep;lodash.iteratee=iteratee;lodash.keys=keys;lodash.map=map;lodash.matches=matches;lodash.mixin=mixin;lodash.negate=negate;lodash.once=once;lodash.pick=pick;lodash.slice=slice;lodash.sortBy=sortBy;lodash.tap=tap;lodash.thru=thru;lodash.toArray=toArray;lodash.values=values;lodash.extend=assignIn;mixin(lodash,lodash);lodash.clone=clone;lodash.escape=escape;lodash.every=every;lodash.find=find;lodash.forEach=forEach;lodash.has=has;lodash.head=head;lodash.identity=identity;lodash.indexOf=indexOf;lodash.isArguments=isArguments;lodash.isArray=isArray;lodash.isBoolean=isBoolean;lodash.isDate=isDate;lodash.isEmpty=isEmpty;lodash.isEqual=isEqual;lodash.isFinite=isFinite;lodash.isFunction=isFunction;lodash.isNaN=isNaN;lodash.isNull=isNull;lodash.isNumber=isNumber;lodash.isObject=isObject;lodash.isRegExp=isRegExp;lodash.isString=isString;lodash.isUndefined=isUndefined;lodash.last=last;lodash.max=max;lodash.min=min;lodash.noConflict=noConflict;lodash.noop=noop;lodash.reduce=reduce;lodash.result=result;lodash.size=size;lodash.some=some;lodash.uniqueId=uniqueId;lodash.each=forEach;lodash.first=head;mixin(lodash,(function(){var source={};baseForOwn(lodash,function(func,methodName){if(!hasOwnProperty.call(lodash.prototype,methodName)){source[methodName]=func;}});return source;}()),{'chain':false});lodash.VERSION=VERSION;baseEach(['pop','join','replace','reverse','split','push','shift','sort','splice','unshift'],function(methodName){var func=(/^(?:replace|split)$/.test(methodName)?String.prototype:arrayProto)[methodName],chainName=/^(?:push|sort|unshift)$/.test(methodName)?'tap':'thru',retUnwrapped=/^(?:pop|join|replace|shift)$/.test(methodName);lodash.prototype[methodName]=function(){var args=arguments;if(retUnwrapped&&!this.__chain__){var value=this.value();return func.apply(isArray(value)?value:[],args);}
return this[chainName](function(value){return func.apply(isArray(value)?value:[],args);});};});lodash.prototype.toJSON=lodash.prototype.valueOf=lodash.prototype.value=wrapperValue;if(typeof define=='function'&&typeof define.amd=='object'&&define.amd){root._=lodash;define(function(){return lodash;});}
else if(freeModule){(freeModule.exports=lodash)._=lodash;freeExports._=lodash;}
else{root._=lodash;}}.call(this));;jQuery.fn.extend({renameAttr:function(name,newName,removeData){var val;return this.each(function(){val=jQuery.attr(this,name);jQuery.attr(this,newName,val);jQuery.removeAttr(this,name);if(removeData!==false){jQuery.removeData(this,name.replace('data-',''));}});}});function checkArrays(arrA,arrB){if(arrA.length!==arrB.length)return false;var cA=arrA.slice().sort().join(",");var cB=arrB.slice().sort().join(",");return cA===cB;}
String.prototype.trimRight=function(charlist){if(charlist===undefined)charlist="\s";return this.replace(new RegExp("["+charlist+"]+$"),"");};String.prototype.trimLeft=function(charlist){if(charlist===undefined)charlist="\s";return this.replace(new RegExp("^["+charlist+"]+"),"");};function convert_to_slug(Text){return Text.replace(/ /g,'-');}
function slug_to_text(Text){return Text.replace(/-/g,' ');}
var stopWordsRE=/(\b(and|of|the|with)\b\s*)/gi;function add_keywords_query(new_keywords){user_query=filter_values_json.query
query=filter_values_json.query
keys_added=''
keys_list=new_keywords.replace(stopWordsRE,"").trim().split(' ')
for(i=0;i<keys_list.length;i++){key=keys_list[i]
if(user_query.indexOf(key)<0){query+=' '+key
keys_added+=' '+key}}
filter_values_json.query=query
$("#query").val(query)
return keys_added}
function remove_keywords_query(keywords){query=''
keys_list=filter_values_json.query.split(' ')
keys_to_remove_list=keywords.split(' ')
for(i=0;i<keys_list.length;i++){key=keys_list[i]
if(keys_to_remove_list.indexOf(key)<0){query+=' '+key}}
filter_values_json.query=query
$("#query").val(query)}
function isNumeric(num){return!isNaN(num)}
function removing_white_spaces(filter_string){filter_string=String(filter_string);return $.trim(filter_string.replace(/ +/g," "))}
function build_url_query_parameters(data_json,exempt_orgs=false){let url="?";for(let key in data_json){let attrValue=data_json[key];if(key==="name"||key==="slug"){continue;}
if(exempt_orgs&&key==="organizations"){continue;}
if(key==="geo"){url+="zoom="+data_json['geo']['zoom']+"&"
url+="clat="+data_json['geo']['center']['lat']+"&"
url+="clon="+data_json['geo']['center']['lon']+"&"
url+="nelat="+data_json['geo']['ne']['lat']+"&"
url+="nelon="+data_json['geo']['ne']['lon']+"&"
url+="swlat="+data_json['geo']['sw']['lat']+"&"
url+="swlon="+data_json['geo']['sw']['lon']+"&"
continue;}
if(key==="query"){for(let i=0;i<attrValue.length;i++){let val=attrValue[i]
url+=key+"="+val.replace(/ /g,'+')+"&"}
continue;}
attrValue=removing_white_spaces(attrValue)
if(!isNaN(attrValue)){url+=key+"="+attrValue+"&"}else{url+=key+"="+attrValue.replace(/ /g,'+')+"&"}}
return url.substring(0,url.length-1);}
function build_url(main_path,data_json,exempt_orgs,sub_path){let url_path="/"+main_path+"/";if(sub_path){url_path=url_path+sub_path+"/";}
return url_path+build_url_query_parameters(data_json,exempt_orgs);}
if(!Array.prototype.indexOf){Array.prototype.indexOf=function(elt){let len=this.length>>>0;let from=Number(arguments[1])||0;from=(from<0)?Math.ceil(from):Math.floor(from);if(from<0)
from+=len;for(;from<len;from++){if(from in this&&this[from]===elt)
return from;}
return-1;};}
function getCookie(name){let cookieValue=null;if(document.cookie&&document.cookie!==''){const cookies=document.cookie.split(';');for(let i=0;i<cookies.length;i++){const cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)===(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;}
function nFormatter(num,digits){num=num*1;let si=[{value:1E18,symbol:"E"},{value:1E15,symbol:"P"},{value:1E12,symbol:"T"},{value:1E9,symbol:"G"},{value:1E6,symbol:"M"},{value:1E3,symbol:"K"}],rx=/\.0+$|(\.[0-9]*[1-9])0+$/,i;for(i=0;i<si.length;i++){if(num>=si[i].value){return(num/si[i].value).toFixed(digits).replace(rx,"$1")+si[i].symbol;}}
return num.toFixed(digits).replace(rx,"$1");}
function dataURLtoBlob(dataurl){let arr=dataurl.split(','),mime=arr[0].match(/:(.*?);/)[1],bstr=atob(arr[1]),n=bstr.length,u8arr=new Uint8Array(n);while(n--){u8arr[n]=bstr.charCodeAt(n);}
return new Blob([u8arr],{type:mime});}
var dashboard_css_style=undefined;function read_css_resource(path){let fr=new FileReader();return fr.readAsText(path);}
async function read_file(path){return new Promise((resolve,reject)=>{jQuery.get(path,function(data){resolve(data);});});}
async function download_item_procedure(svg_container_id,file_name,is_ezassi){if(TEMPLATE_NAME==='search'){ga_eventa('click','search_dataAnalytics_download');}else{ga_eventa('click','organizations_dataInsightsTab_filters_download');}
if(dashboard_css_style===undefined){dashboard_css_style="\n";if(is_ezassi){dashboard_css_style+=await read_file('/static/css/ezassi/global.css');dashboard_css_style+=await read_file('/static/css/ezassi/dashboard/d3_graphs.css');}else{dashboard_css_style+=await read_file('/static/css/global.css');dashboard_css_style+=await read_file('/static/css/dashboard/d3_graphs.css');}
$('svg').prepend("\n<style type='text/css'></style>");$('svg').find("style").html("\n<![CDATA["+dashboard_css_style+"]]>\n");}
$(svg_container_id+">svg").attr("width",$(svg_container_id+">svg").width());$(svg_container_id+" .editable-legend").css("display","none");$(svg_container_id+" .exportable-legend").css("display","unset");let element=d3.select(svg_container_id).select("svg:not(#spinner)");let html=element.attr("version",1.1).attr("xmlns","http://www.w3.org/2000/svg").node().outerHTML;let svg_w=element.style("width");let svg_h=element.style("height");let canvas=$("#dashboard_css_canvas")[0];let scale_by=4;if(file_name==='main_themes'){scale_by=1}
canvas.width=svg_w.substring(0,svg_w.length-2)*scale_by;canvas.height=svg_h.substring(0,svg_h.length-2)*scale_by;canvas.style.width=svg_w.substring(0,svg_w.length-2)+'px';canvas.style.height=svg_h.substring(0,svg_h.length-2)+'px';let context=canvas.getContext("2d");context.scale(scale_by,scale_by);$(svg_container_id+" .editable-legend").css("display","unset");$(svg_container_id+" .exportable-legend").css("display","none");return[html,canvas,context];}
async function download_item_linknovate(svg_container_id,file_name){var func_result=await download_item_procedure(svg_container_id,file_name,false);let html=func_result[0];let canvas=func_result[1];let context=func_result[2];let imgsrc='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(html)));let image=new Image;image.src=imgsrc;query_name=query_name.replace(/\s+/g,'_').toLowerCase();let csrftoken=getCookie('csrftoken');image.onload=function(){let a=document.createElement('a');context.drawImage(image,0,0);var imgData=canvas.toDataURL({format:'png'});$.ajax({url:'/insert-watermark/',type:"POST",data:{"imgsrc":imgData},beforeSend:function(xhr,settings){xhr.setRequestHeader("X-CSRFToken",csrftoken);},success:function(response,data){let watermark_data=response['watermark']
let blob=dataURLtoBlob(watermark_data);saveAs(blob,query_name+'_'+file_name+".png");}});};}
async function download_item_ezassi(svg_container_id,file_name){let func_result=await download_item_procedure(svg_container_id,file_name,true);var html=func_result[0];var canvas=func_result[1];var context=func_result[2];var imgsrc='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(html)));var image=new Image;image.src=imgsrc;query_name=query_name.replace(/\s+/g,'_').toLowerCase();var csrftoken=getCookie('csrftoken');image.onload=function(){var a=document.createElement('a');context.drawImage(image,0,0);var imgData=canvas.toDataURL({format:'png'});var blob=dataURLtoBlob(imgData);saveAs(blob,query_name+'_'+file_name+".png");};}
function download_item(svg_container_id,file_name){if(document.URL.indexOf('ezassi')!==-1){download_item_ezassi(svg_container_id,file_name);}else{download_item_linknovate(svg_container_id,file_name);}}
function download_data_source(filename,rows_container){let rows=[];let simple_rows=$(rows_container).data("chartDataSource").split("##");simple_rows.forEach(function(row){rows.push(row.split(","));});var processRow=function(row){var finalVal='';for(var j=0;j<row.length;j++){var innerValue=row[j]===null?'':row[j].toString();if(row[j]instanceof Date){innerValue=row[j].toLocaleString();}
var result=innerValue.replace(/"/g,'""');if(result.search(/("|,|\n)/g)>=0)
result='"'+result+'"';if(j>0)
finalVal+=',';finalVal+=result;}
return finalVal+'\n';};var csvFile='';for(var i=0;i<rows.length;i++){csvFile+=processRow(rows[i]);}
var blob=new Blob([csvFile],{type:'text/csv;charset=utf-8;'});if(navigator.msSaveBlob){navigator.msSaveBlob(blob,filename);}else{var link=document.createElement("a");if(link.download!==undefined){var url=URL.createObjectURL(blob);link.setAttribute("href",url);link.setAttribute("download",filename);link.style.visibility='hidden';document.body.appendChild(link);link.click();document.body.removeChild(link);}}}
function remove_not_loaded_pngs(pngs){let current_pngs={};for(let svg_key in pngs){if(pngs.hasOwnProperty(svg_key)){let obj=pngs[svg_key];if(obj.length>1000){current_pngs[svg_key]=obj;}}}
return current_pngs;}
function canvas_to_png(canvas){let pngs={};let id;for(let i in canvas){if(canvas.hasOwnProperty(i)){id=canvas[i];pngs[id]=$("#"+id).find('canvas')[0].toDataURL("image/png");}}
return pngs}
function svg_to_png(svgs,pngs,cb){if(svgs.length===0){cb(pngs);}else{let svg_id=svgs.pop();if($('#'+svg_id+" svg")[0]){let dashboard_css_style="\n";for(let i=0;i<document.styleSheets.length;i++){if(document.styleSheets[i].href===null||document.styleSheets[i].href===undefined){continue;}
let str=document.styleSheets[i].href.split("/");if(str[str.length-1].startsWith("d3-styles.css?v=")){let rules=document.styleSheets[i].rules||document.styleSheets[i].cssRules;for(let j=0;j<rules.length;j++){dashboard_css_style+=(rules[j].cssText+"\n");}
break;}}
$('svg').prepend("\n<style type='text/css'></style>").find("style").html("\n<![CDATA["+dashboard_css_style+"]]>\n");$("#"+svg_id+">svg").attr("width",$("#"+svg_id+">svg").width());var element=d3.select('#'+svg_id).select("svg");var html=element.attr("version",1.1).attr("xmlns","http://www.w3.org/2000/svg").node().parentNode.innerHTML;var svg_w=element.style("width");var svg_h=element.style("height");var canvas=$("#dashboard_css_canvas")[0];var scale_by=3;canvas.width=svg_w.substring(0,svg_w.length-2)*scale_by;canvas.height=svg_h.substring(0,svg_h.length-2)*scale_by;canvas.style.width=svg_w.substring(0,svg_w.length-2)+'px';canvas.style.height=svg_h.substring(0,svg_h.length-2)+'px';var context=canvas.getContext("2d");context.scale(scale_by,scale_by);var imgsrc='data:image/svg+xml;base64,'+btoa(decodeURIComponent(encodeURIComponent(html)));var image=new Image;image.src=imgsrc;query_name=query_name.replace(/\s+/g,'_').toLowerCase();image.onload=function(){context.drawImage(image,0,0);pngs[svg_id]=canvas.toDataURL('image/png');svg_to_png(svgs,pngs,cb);};}else{svg_to_png(svgs,pngs,cb);}}}
function ga_eventa(category,action){ga('send','event',category,action);}
function ga_evental(category,action,label){ga('send','event',category,action,label);}
function ga_eventu(category,action,user_id){ga('send','event',category,action,{'dimension1':user_id});}
function scrollToSection(section_str){$('section').animate({scrollTop:$(section_str).offset().top},1500);}
function scrollToTop(){$('section').animate({scrollTop:'0px'},300);}
function scrollToTab(){$('.tab-content').animate({scrollTop:'0px'},300);}
function getParameterByName(name,url){if(!url)url=window.location.href;name=name.replace(/[\[\]]/g,"\\$&");var regex=new RegExp("[?&]"+name+"(=([^&#]*)|&|#|$)"),results=regex.exec(url);if(!results)return null;if(!results[2])return'';return decodeURIComponent(results[2].replace(/\+/g," "));}
function select_sign_in_tab(){$("#signin-tab").parent().addClass("selected")
$("#signup-tab").parent().removeClass("selected")}
function select_sign_up_tab(){$("#signin-tab").parent().removeClass("selected");$("#signup-tab").parent().addClass("selected");}
function createCookie(name,value,days){if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString();}else var expires="";document.cookie=name+"="+value+expires+"; path=/";}
function readCookie(name){var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);}
return null;}
function eraseCookie(name){createCookie(name,"",-1);}
function expireAllCookies(name,paths){var expires=new Date(0).toUTCString();document.cookie=name+'=; expires='+expires;for(var i=0,l=paths.length;i<l;i++){document.cookie=name+'=; path='+paths[i]+'; expires='+expires;}}
var signup_reason='';function set_signup_reason(reason){expireAllCookies('_reason',['/','/path/']);createCookie("_reason",reason,1);signup_reason=reason}
function unfollowHoverEffect(id){$(id).removeClass('bt-btn-transparent').addClass('bt-btn-transparent-unf');$(id).off().hover(function(){$(id).find("span").text('Unfollow');},function(){$(id).find("span").text('Following alert');});}
function createAlertEffect(id){$(id).removeClass('bt-btn-transparent-unf').addClass('bt-btn-transparent');$(id).find("span").text('Manage alerts');$(id).off();}
function saveQuery(btn,alertName=undefined,alertId=undefined,onSuccess=(_)=>{}){let values=jQuery.extend(true,{},filter_values_json);values['url']=remove_parameter_from_url(window.location.href,['alert']);if(alertName)
values['name_query']=alertName;if(alertId)
values['alert_id']=alertId;let csrftoken=getCookie('csrftoken');$(document).off("ajaxStart");$.ajax({'url':save_query_url,'type':"POST",'data':values,beforeSend:function(xhr,settings){xhr.setRequestHeader("X-CSRFToken",csrftoken);},success:function(data){onSuccess(data);unfollowHoverEffect('#'+$(btn)[0].id);animate_item($(btn)[0].id,'flash');},error:function(xhr,errmsg,err){showErrorPleaseRetry();}});}
function deleteQuery(btn,tree_node_id){let json_obj={'node_id':tree_node_id};$(btn).off();$.ajax({'url':"/delete-item-my-projects/",'type':"DELETE",'beforeSend':function(xhr,settings){xhr.setRequestHeader("X-CSRFToken",getCookie('csrftoken'));},'data':json_obj,'success':function(data){createAlertEffect('#'+$(btn)[0].id);animate_item($(btn)[0].id,'flash');},'error':function(xhr,errmsg,err){showErrorPleaseRetry();}});}
function validate_website(url){var re=/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;if(!re.test(url)){return false;}else{return true}}
function getUrlParameter(sParam){var sPageURL=decodeURIComponent(window.location.search.substring(1)),sURLVariables=sPageURL.split('&'),sParameterName,i;for(i=0;i<sURLVariables.length;i++){sParameterName=sURLVariables[i].split('=');if(sParameterName[0]===sParam){return sParameterName[1]===undefined?true:sParameterName[1];}}}
function is_mobile(){return!!(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i));}
function commentGrowl(msg,type,delay=3000){$.bootstrapGrowl(msg,{type:type,offset:{from:'bottom',amount:20},width:'auto',align:'center',delay:delay});}
var errorPleaseReloadText="Something went wrong. Please reload the page."
function showErrorPleaseReload(){commentGrowl(errorPleaseReloadText,"my-error")}
var errorPleaseRetryText="Something went wrong. Please try again."
function showErrorPleaseRetry(){commentGrowl(errorPleaseRetryText,"my-error")}
var errorSomeoneElseMakingChangesText="Someone else is also making changes right now. Please try again in a few seconds."
function showErrorUnableEditLock(){commentGrowl(errorSomeoneElseMakingChangesText,"my-error")}
var errorPleaseContactText="Something went wrong, please contact info@linknovate.com"
function showErrorPleaseContact(){commentGrowl(errorPleaseContactText,"my-error")}
var errorOperationTimeoutLknText="This operation is taking longer than expected. The dev team has been notified."
function showOperationTimeoutLkn(){commentGrowl(errorOperationTimeoutLknText,"my-error")}
function insertParam(key,value){var path=window.location.pathname;key=encodeURIComponent(key);value=encodeURIComponent(value);var location_search=document.location.search.trim();var kvp=location_search!==""?location_search.substr(1).split('&'):[];let i=0;for(;i<kvp.length;i++){if(kvp[i].startsWith(key+'=')){let pair=kvp[i].split('=');pair[1]=value;kvp[i]=pair.join('=');break;}}
if(i>=kvp.length&&value!=="")kvp[kvp.length]=[key,value].join('=');else if(i<kvp.length&&value==="")kvp.splice(i,1);let search_info=kvp.join('&').trim();search_info=search_info!==""?"?"+search_info:".";window.history.pushState({path:search_info},'',search_info);$(window).on("popstate",function(){$.getScript(window.location.href);});return search_info;}
function performAjaxPOSTToDownloadFile(url,json,auxLinkElement,defaultFileName){ajax_call=$.ajax({url:url,type:"POST",data:JSON.stringify(json),cache:false,xhrFields:{responseType:'blob'},beforeSend:function(xhr,settings){xhr.setRequestHeader("X-CSRFToken",getCookie('csrftoken'));},}).done(function(data,textStatus,jqXHR){let aux=jqXHR.getResponseHeader("content-disposition").match(/filename="(.+?)"(?:;.*)?$/)
let fileName=aux?aux[1]:defaultFileName
auxLinkElement.href=window.URL.createObjectURL(data);auxLinkElement.download=fileName;auxLinkElement.click();window.URL.revokeObjectURL(auxLinkElement.href)})
return ajax_call}
function detect_leaving_intent(cb){document.addEventListener("mouseleave",function(e){if(e.clientY<0)cb();},false);}
function close_all_active_modals(){$('.modal.show').each(function(_,elem){let modal=bootstrap.Modal.getOrCreateInstance(elem);modal.hide();});}
function show_loading_ajax_filters(){$('body').css('opacity','0.4');$("#loader_ajax").show();}
function remove_loading_ajax_filters(){$("#loader_ajax").hide();$('body').css('opacity','initial');}
function isoStrToLocalStr(isoDateStr){return new Date(isoDateStr).toLocaleString("en-US",{day:"numeric",year:"numeric",month:"short",hour:"numeric",minute:"2-digit"})}
function get_parameter_from_url(param_name){let url=new URL(window.location.href);return url.searchParams.get(param_name);}
function add_parameter_to_url(url,params){let new_url=new URL(url);Object.entries(params).forEach(([key,value])=>{new_url.searchParams.set(key,value);})
return new_url.href;}
function remove_parameter_from_url(url,params){let new_url=new URL(url);params.forEach(key=>{new_url.searchParams.delete(key);})
return new_url.href;}
function validate_email(email){let email_regex=new RegExp("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");return email_regex.test(email);}
function paste_as_plain_text(event){event.preventDefault();let text=event.clipboardData.getData('text/plain');document.execCommand('insertText',false,text);}
function set_paste_as_plain_text(element){element.removeEventListener('paste',paste_as_plain_text);element.addEventListener('paste',paste_as_plain_text);}
function animate_item(element_id,animation){$('#'+element_id).removeClass(animation+' animated').addClass(animation+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){$(this).removeClass(animation+' animated');});}
function replace_click_events(list_of_selectors,new_event){$.each(list_of_selectors,function(index,elements_to_attach_event){let $elements_to_attach_event=$(elements_to_attach_event);$elements_to_attach_event.removeAttr("href");$elements_to_attach_event.removeAttr("onclick");$elements_to_attach_event.removeAttr("data-bs-target");$elements_to_attach_event.css('cursor','pointer')
$elements_to_attach_event.unbind('click');$elements_to_attach_event.click(new_event);})}
function get_org_type_colors(is_partner_view){let all_colors=[];for(const[_key,value]of Object.entries(org_types_by_graph_name_dict)){if(is_partner_view){all_colors.push(value['partner_chart_color']);}else{all_colors.push(value['chart_color']);}}
return all_colors;}
function get_org_type_names(){let all_names=[];for(const[key,_value]of Object.entries(org_types_by_graph_name_dict)){all_names.push(key)}
return all_names;}
function onElementVisible(element_id,callback,disconnect=false){let observed_element=document.querySelector("#"+element_id);if(observed_element){new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.intersectionRatio>0){callback();if(disconnect){observer.disconnect();}}});}).observe(observed_element);}}
function handleDropdownClick(clickEvent){let clickedElement=clickEvent.delegateTarget;if(!clickedElement){return;}
clickEvent.stopPropagation();let $clickedParent=$(clickEvent.currentTarget);let dropdownToggles=$clickedParent.find('.dropdown-toggle');dropdownToggles.each(function(_,element){if(element!==clickedElement){let otherDropdownElement=bootstrap.Dropdown.getInstance(element);if(otherDropdownElement){otherDropdownElement.hide();}}});}
function formatDateToOffset(date){let extDate=new Date(date);let formattedExtDate=new Date(extDate.getTime()-(extDate.getTimezoneOffset()*60*1000))
return formattedExtDate.toISOString().split('T')[0]}
function fromHexColor(hexCol){return{r:parseInt(hexCol.substring(1,3),16),g:parseInt(hexCol.substring(3,5),16),b:parseInt(hexCol.substring(5,7),16),}}
function toHexColor(rgbDict){let r=rgbDict.r.toString(16);let g=rgbDict.g.toString(16);let b=rgbDict.b.toString(16);if(r.length==1)
r="0"+r;if(g.length==1)
g="0"+g;if(b.length==1)
b="0"+b;return"#"+r+g+b;}
function createGrad(startColor,endColor,stops){result=[]
let auxStartColor,auxEndColor
auxStartColor=fromHexColor(startColor)
auxEndColor=fromHexColor(endColor)
auxStartColor={r:auxStartColor.r*auxStartColor.r,g:auxStartColor.g*auxStartColor.g,b:auxStartColor.b*auxStartColor.b}
auxEndColor={r:auxEndColor.r*auxEndColor.r,g:auxEndColor.g*auxEndColor.g,b:auxEndColor.b*auxEndColor.b}
let currentColour={r:auxStartColor.r,g:auxStartColor.g,b:auxStartColor.b};function interpolateCos(a,b,px){var ft=px*Math.PI,f=(1-Math.cos(ft))*0.5;return a*(1-f)+b*f;}
function interpolate(a,b,px){return a*(1-px)+b*px;}
var i=0
while(i<stops){percent=i/(stops-1);currentColour.r=Math.floor(Math.sqrt(interpolate(auxStartColor.r,auxEndColor.r,percent)));currentColour.g=Math.floor(Math.sqrt(interpolate(auxStartColor.g,auxEndColor.g,percent)));currentColour.b=Math.floor(Math.sqrt(interpolate(auxStartColor.b,auxEndColor.b,percent)));result.push(toHexColor(currentColour))
i++;}
return result}
function show_loading_ajax_filters_with_body_opacity(){$('body').css('opacity','0.4');$("#loader_ajax").show();}
function remove_loading_ajax_filters_with_body_opacity(){$("#loader_ajax").hide();$('body').css('opacity','initial');};$(function(){$('[data-bs-toggle="tooltip"]').tooltip();});function menu(){$('nav').toggleClass('closed');}
function add_http(url){var pattern=/^((http|https|ftp):\/\/)/;if(!pattern.test(url)){url="http://"+url;}
return url}
function isUrlValid(userInput){var regexQuery="^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,15}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";var url=new RegExp(regexQuery,"i");if(url.test(userInput)){return true;}
return false;};