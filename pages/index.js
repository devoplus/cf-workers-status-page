import { Store } from 'laco'
import { useStore } from 'laco-react'
import Head from 'flareact/head'

import { getKVMonitors, useKeyPress } from '../src/functions/helpers'
import config from '../config.yaml'
import MonitorCard from '../src/components/monitorCard'
import MonitorFilter from '../src/components/monitorFilter'
import MonitorStatusHeader from '../src/components/monitorStatusHeader'
import ThemeSwitcher from '../src/components/themeSwitcher'

const MonitorStore = new Store({
  monitors: config.monitors,
  visible: config.monitors,
  activeFilter: false,
})

const filterByTerm = (term) =>
  MonitorStore.set((state) => ({
    visible: state.monitors.filter((monitor) =>
      monitor.name.toLowerCase().includes(term),
    ),
  }))

export async function getEdgeProps() {
  // get KV data
  const kvMonitors = await getKVMonitors()

  return {
    props: {
      config,
      kvMonitors: kvMonitors ? kvMonitors.monitors : {},
      kvMonitorsLastUpdate: kvMonitors ? kvMonitors.lastUpdate : {},
    },
    // Revalidate these props once every x seconds
    revalidate: 5,
  }
}

export default function Index({ config, kvMonitors, kvMonitorsLastUpdate }) {
  const state = useStore(MonitorStore)
  const slash = useKeyPress('/')

  return (
    <div className="min-h-screen">
      <Head>
        <title>{config.settings.title}</title>
        <link rel="stylesheet" href="./style.css" />
        
        <script>
          {`
          function setTheme(theme) {
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(theme)
            localStorage.theme = theme
          }

          var jLinq;var jlinq;var jl;(function(){var framework={command:{query:0,select:1,action:2},exp:{get_path:/\./g,escape_regex:/[\-\[\]\{\}\(\)\*\+\?\.\,\\\^\$\|\#\s]/g},type:{nothing:-1,undefined:0,string:1,number:2,array:3,regex:4,bool:5,method:6,datetime:7,object:99},library:{commands:{},types:{},addType:function(type,compare){framework.library.types[type]=compare;},extend:function(commands){if(!framework.util.isType(framework.type.array,commands)){commands=[commands];}
          framework.util.each(commands,function(command){framework.library.commands[command.name]=command;});},query:function(collection,params){if(!framework.util.isType(framework.type.array,collection)){throw "jLinq can only query arrays of objects.";}
          collection=params.clone||(params.clone==null&&jLinq.alwaysClone)?framework.util.clone(collection):collection;var self={instance:{ignoreCase:jLinq.ignoreCase,not:false,lastCommand:null,lastField:null,records:collection,removed:[],or:function(){self.startNewCommandSet();},query:{}},canRepeatCommand:function(args){return self.instance.lastCommand!=null&&args.length==(self.instance.lastCommand.method.length+1)&&framework.util.isType(framework.type.string,args[0])},commands:[[]],execute:function(){var results=[];var state=self.instance;framework.util.each(self.instance.records,function(record){state.record=record;if(self.evaluate(state)){results.push(record);}
          else{self.instance.removed.push(record);}});self.instance.records=results;},findValue:framework.util.findValue,evaluate:function(state){for(var command=0,l=self.commands.length;command<l;command++){var set=self.commands[command];if(self.evaluateSet(set,state)){return true;}};return false;},evaluateSet:function(set,state){for(var item in set){if(!set.hasOwnProperty(item))continue;var command=set[item];state.value=self.findValue(state.record,command.path);state.compare=function(types){return framework.util.compare(state.value,types,state);};state.when=function(types){return framework.util.when(state.value,types,state);};try{var result=command.method.apply(state,command.args);if(command.not){result=!result;}
          if(!result){return false;}}
          catch(e){return false;}}
          return true;},repeat:function(arguments){if(!self.instance.lastCommand||arguments==null){return;}
          arguments=framework.util.toArray(arguments);if(self.canRepeatCommand(arguments)){self.instance.lastField=arguments[0];arguments=framework.util.select(arguments,null,1,null);}
          self.queue(self.instance.lastCommand,arguments);},queue:function(command,args){self.instance.lastCommand=command;var detail={name:command.name,method:command.method,field:self.instance.lastField,count:command.method.length,args:args,not:self.not};if(detail.args.length>command.method.length){detail.field=detail.args[0];detail.args=framework.util.remaining(detail.args,1);self.instance.lastField=detail.field;}
          detail.path=detail.field;self.commands[self.commands.length-1].push(detail);self.not=false;},startNewCommandSet:function(){self.commands.push([]);},setNot:function(){self.not=!self.not;}};framework.util.each(framework.library.commands,function(command){if(command.type==framework.command.query){var action=function(){self.queue(command,arguments);return self.instance.query;};self.instance.query[command.name]=action;var name=framework.util.operatorName(command.name);self.instance.query["or"+name]=function(){self.startNewCommandSet();return action.apply(null,arguments);};self.instance.query["orNot"+name]=function(){self.startNewCommandSet();self.setNot();return action.apply(null,arguments);};self.instance.query["and"+name]=function(){return action.apply(null,arguments);};self.instance.query["andNot"+name]=function(){self.setNot();return action.apply(null,arguments);};self.instance.query["not"+name]=function(){self.setNot();return action.apply(null,arguments);};}
          else if(command.type==framework.command.select){self.instance.query[command.name]=function(){self.execute();var state=self.instance;state.compare=function(value,types){return framework.util.compare(value,types,state);};state.when=function(value,types){return framework.util.when(value,types,state);};return command.method.apply(state,arguments);};}
          else if(command.type==framework.command.action){self.instance.query[command.name]=function(){var state=self.instance;state.compare=function(value,types){return framework.util.compare(value,types,state);};state.when=function(value,types){return framework.util.when(value,types,state);};command.method.apply(state,arguments);return self.instance.query;};}});self.instance.query.or=function(){self.startNewCommandSet();self.repeat(arguments);return self.instance.query;};self.instance.query.and=function(){self.repeat(arguments);return self.instance.query;};self.instance.query.not=function(){self.setNot();self.repeat(arguments);return self.instance.query;};self.instance.query.andNot=function(){self.setNot();self.repeat(arguments);return self.instance.query;};self.instance.query.orNot=function(){self.startNewCommandSet();self.setNot();self.repeat(arguments);return self.instance.query;};return self.instance.query;}},util:{trim:function(value){value=value==null?"":value;value=value.toString();return value.replace(/^\s*|\s*$/g,"");},cloneArray:function(array){var result=[];framework.util.each(array,function(item){result.push(framework.util.clone(item));});return result;},clone:function(obj){if(framework.util.isType(framework.type.array,obj)){return framework.util.cloneArray(obj);}
          else if(framework.util.isType(framework.type.object,obj)){var clone={};for(var item in obj){if(obj.hasOwnProperty(item))clone[item]=framework.util.clone(obj[item]);}
          return clone;}
          else{return obj;}},invoke:function(obj,args){args=args.concat();var path=args[0];var method=framework.util.findValue(obj,path);args=framework.util.select(args,null,1,null);path=path.replace(/\..*$/,"");var parent=framework.util.findValue(obj,path);obj=parent===method?obj:parent;try{var result=method.apply(obj,args);return result;}
          catch(e){return null;}},getPath:function(path){return framework.util.toString(path).split(framework.exp.get_path);},findValue:function(obj,path){if(framework.util.isType(framework.type.array,path)){return framework.util.invoke(obj,path);}
          else if(framework.util.isType(framework.type.string,path)){path=framework.util.getPath(path);var index=0;while(obj!=null&&index<path.length){obj=obj[path[index++]];}
          return obj;}
          else{return obj;}},elementAt:function(collection,index){return collection&&collection.length>0&&index<collection.length&&index>=0?collection[index]:null;},regexEscape:function(val){return(val?val:"").toString().replace(framework.exp.escape_regex,"\\$&");},regexMatch:function(expression,source,ignoreCase){if(framework.util.isType(framework.type.regex,expression)){expression=expression.source;}
          expression=new RegExp(framework.util.toString(expression),ignoreCase?"gi":"g");return framework.util.toString(source).match(expression)!=null;},operatorName:function(name){return name.replace(/^\w/,function(match){return match.toUpperCase();});},compare:function(value,types,state){var result=framework.util.when(value,types,state);return result==true?result:false;},when:function(value,types,state){var kind=framework.util.getType(value);for(var item in types){if(!types.hasOwnProperty(item))continue;var type=framework.type[item];if(type==kind){return types[item].apply(state,[value]);}}
          if(types.other){return types.other.apply(state,[value]);}
          return null;},each:function(collection,action){var index=0;for(var item in collection){if(collection.hasOwnProperty(item))action(collection[item],index++);}},grab:function(collection,action){var list=[];framework.util.each(collection,function(item){list.push(action(item));});return list;},until:function(collection,action){for(var item=0,l=collection.length;item<l;item++){var result=action(collection[item],item+1);if(result===true){return true;}}
          return false;},isType:function(type,value){return framework.util.getType(value)==type;},getType:function(obj){if(obj==null){return framework.type.nothing;}
          for(var item in framework.library.types){if(framework.library.types[item](obj)){return item;}}
          return framework.type.object;},remaining:function(array,at){var results=[];for(;at<array.length;at++)results.push(array[at]);return results;},apply:function(target,source){for(var item in source){if(source.hasOwnProperty(item))target[item]=source[item];}
          return target;},reorder:function(collection,fields,ignoreCase){return framework.util._performSort(collection,fields,ignoreCase);},_performSort:function(collection,fields,ignoreCase){var field=fields.splice(0,1);if(field.length==0){return collection;}
          field=field[0];var invoked=framework.util.isType(framework.type.array,field);var name=(invoked?field[0]:field);var desc=name.match(/^\-/);name=desc?name.substr(1):name;if(desc){if(invoked){field[0]=name;}else{field=name;}}
          var sort=function(val1,val2){var a=framework.util.findValue(val1,field);var b=framework.util.findValue(val2,field);if(a==null&&b==null){a=0;b=0;}
          else if(a==null&&b!=null){a=0;b=1;}
          else if(a!=null&&b==null){a=1;b=0;}
          else if(ignoreCase&&framework.util.isType(framework.type.string,a)&&framework.util.isType(framework.type.string,b)){a=a.toLowerCase();b=b.toLowerCase();}
          else if(a.length&&b.length){a=a.length;b=b.length;}
          var result=(a<b)?-1:(a>b)?1:0;return desc?-result:result;};collection.sort(sort);if(fields.length>0){var sorted=[];var groups=framework.util.group(collection,field,ignoreCase);framework.util.each(groups,function(group){var listing=fields.slice();var records=framework.util._performSort(group,listing,ignoreCase);sorted=sorted.concat(records);});collection=sorted;}
          return collection;},group:function(records,field,ignoreCase){var groups={};for(var item=0,l=records.length;item<l;item++){var record=records[item];var alias=framework.util.toString(framework.util.findValue(record,field));alias=ignoreCase?alias.toUpperCase():alias;if(!groups[alias]){groups[alias]=[record];}
          else{groups[alias].push(record);}}
          return groups;},equals:function(val1,val2,ignoreCase){return framework.util.when(val1,{string:function(){return framework.util.regexMatch("^"+framework.util.regexEscape(val2)+"$",val1,ignoreCase);},other:function(){return(val1==null&&val2==null)||(val1===val2);}});},toArray:function(obj){var items=[];if(obj.length){for(var i=0;i<obj.length;i++){items.push(obj[i]);}}
          else{for(var item in obj){if(obj.hasOwnProperty(item))items.push(obj[item]);}}
          return items;},toString:function(val){return val==null?"":val.toString();},skipTake:function(collection,action,skip,take){skip=skip==null?0:skip;take=take==null?collection.length:take;if(skip>=collection.length||take==0){return[];}
          return framework.util.select(collection,action,skip,skip+take);},select:function(collection,action,start,end){start=start==null?0:start;end=end==null?collection.length:end;var results=collection.slice(start,end);if(jLinq.util.isType(jLinq.type.object,action)){var map=action;action=function(rec){var create={};for(var item in map){if(!map.hasOwnProperty(item))continue;create[item]=rec[item]?rec[item]:map[item];}
          return create;};};if(jLinq.util.isType(jLinq.type.method,action)){for(var i=0;i<results.length;i++){var record=results[i];results[i]=action.apply(record,[record]);}}
          return results;}}};framework.library.addType(framework.type.nothing,function(value){return value==null;});framework.library.addType(framework.type.array,function(value){return value instanceof Array;});framework.library.addType(framework.type.string,function(value){return value.substr&&value.toLowerCase;});framework.library.addType(framework.type.number,function(value){return value.toFixed&&value.toExponential;});framework.library.addType(framework.type.regex,function(value){return value instanceof RegExp;});framework.library.addType(framework.type.bool,function(value){return value==true||value==false;});framework.library.addType(framework.type.method,function(value){return value instanceof Function;});framework.library.addType(framework.type.datetime,function(value){return value instanceof Date;});framework.library.extend([{name:"ignoreCase",type:framework.command.action,method:function(){this.ignoreCase=true;}},{name:"reverse",type:framework.command.action,method:function(){this.records.reverse();}},{name:"useCase",type:framework.command.action,method:function(){this.ignoreCase=false;}},{name:"each",type:framework.command.action,method:function(action){jLinq.util.each(this.records,function(record){action(record);});}},{name:"attach",type:framework.command.action,method:function(field,action){this.when(action,{method:function(){jLinq.util.each(this.records,function(record){record[field]=action(record);});},other:function(){jLinq.util.each(this.records,function(record){record[field]=action;});}});}},{name:"join",type:framework.command.action,method:function(source,alias,pk,fk){jLinq.util.each(this.records,function(record){record[alias]=jLinq.from(source).equals(fk,record[pk]).select();});}},{name:"assign",type:framework.command.action,method:function(source,alias,pk,fk,fallback){jLinq.util.each(this.records,function(record){record[alias]=jLinq.from(source).equals(fk,record[pk]).first(fallback);});}},{name:"sort",type:framework.command.action,method:function(){var args=jLinq.util.toArray(arguments);this.records=jLinq.util.reorder(this.records,args,this.ignoreCase);}},{name:"equals",type:framework.command.query,method:function(value){return jLinq.util.equals(this.value,value,this.ignoreCase);}},{name:"starts",type:framework.command.query,method:function(value){return this.compare({array:function(){return jLinq.util.equals(this.value[0],value,this.ignoreCase);},other:function(){return jLinq.util.regexMatch(("^"+jLinq.util.regexEscape(value)),this.value,this.ignoreCase);}});}},{name:"ends",type:framework.command.query,method:function(value){return this.compare({array:function(){return jLinq.util.equals(this.value[this.value.length-1],value,this.ignoreCase);},other:function(){return jLinq.util.regexMatch((jLinq.util.regexEscape(value)+"$"),this.value,this.ignoreCase);}});}},{name:"contains",type:framework.command.query,method:function(value){return this.compare({array:function(){var ignoreCase=this.ignoreCase;return jLinq.util.until(this.value,function(item){return jLinq.util.equals(item,value,ignoreCase);});},other:function(){return jLinq.util.regexMatch(jLinq.util.regexEscape(value),this.value,this.ignoreCase);}});}},{name:"match",type:framework.command.query,method:function(value){return this.compare({array:function(){var ignoreCase=this.ignoreCase;return jLinq.util.until(this.value,function(item){return jLinq.util.regexMatch(value,item,ignoreCase);});},other:function(){return jLinq.util.regexMatch(value,this.value,this.ignoreCase);}});}},{name:"type",type:framework.command.query,method:function(type){return jLinq.util.isType(type,this.value);}},{name:"greater",type:framework.command.query,method:function(value){return this.compare({array:function(){return this.value.length>value;},string:function(){return this.value.length>value;},other:function(){return this.value>value;}});}},{name:"greaterEquals",type:framework.command.query,method:function(value){return this.compare({array:function(){return this.value.length>=value;},string:function(){return this.value.length>=value;},other:function(){return this.value>=value;}});}},{name:"less",type:framework.command.query,method:function(value){return this.compare({array:function(){return this.value.length<value;},string:function(){return this.value.length<value;},other:function(){return this.value<value;}});}},{name:"lessEquals",type:framework.command.query,method:function(value){return this.compare({array:function(){return this.value.length<=value;},string:function(){return this.value.length<=value;},other:function(){return this.value<=value;}});}},{name:"between",type:framework.command.query,method:function(low,high){return this.compare({array:function(){return this.value.length>low&&this.value.length<high;},string:function(){return this.value.length>low&&this.value.length<high;},other:function(){return this.value>low&&this.value<high;}});}},{name:"betweenEquals",type:framework.command.query,method:function(low,high){return this.compare({array:function(){return this.value.length>=low&&this.value.length<=high;},string:function(){return this.value.length>=low&&this.value.length<=high;},other:function(){return this.value>=low&&this.value<=high;}});}},{name:"empty",type:framework.command.query,method:function(){return this.compare({array:function(){return this.value.length==0;},string:function(){return jLinq.util.trim(this.value).length==0;},other:function(){return this.value==null;}});}},{name:"is",type:framework.command.query,method:function(){return this.compare({bool:function(){return this.value===true;},other:function(){return this.value!=null;}});}},{name:"min",type:framework.command.select,method:function(field){var matches=jLinq.util.reorder(this.records,[field],this.ignoreCase);return jLinq.util.elementAt(matches,0);}},{name:"max",type:framework.command.select,method:function(field){var matches=jLinq.util.reorder(this.records,[field],this.ignoreCase);return jLinq.util.elementAt(matches,matches.length-1);}},{name:"sum",type:framework.command.select,method:function(field){var sum;jLinq.util.each(this.records,function(record){var value=jLinq.util.findValue(record,field);sum=sum==null?value:(sum+value);});return sum;}},{name:"average",type:framework.command.select,method:function(field){var sum;jLinq.util.each(this.records,function(record){var value=jLinq.util.findValue(record,field);sum=sum==null?value:(sum+value);});return sum/this.records.length;}},{name:"skip",type:framework.command.select,method:function(skip,selection){this.records=this.when(selection,{method:function(){return jLinq.util.skipTake(this.records,selection,skip,null);},object:function(){return jLinq.util.skipTake(this.records,selection,skip,null);},other:function(){return jLinq.util.skipTake(this.records,null,skip,null);}});return this.query;}},{name:"take",type:framework.command.select,method:function(take,selection){return this.when(selection,{method:function(){return jLinq.util.skipTake(this.records,selection,null,take);},object:function(){return jLinq.util.skipTake(this.records,selection,null,take);},other:function(){return jLinq.util.skipTake(this.records,null,null,take);}});}},{name:"skipTake",type:framework.command.select,method:function(skip,take,selection){return this.when(selection,{method:function(){return jLinq.util.skipTake(this.records,selection,skip,take);},object:function(){return jLinq.util.skipTake(this.records,selection,skip,take);},other:function(){return jLinq.util.skipTake(this.records,null,skip,take);}});}},{name:"select",type:framework.command.select,method:function(selection){return this.when(selection,{method:function(){return jLinq.util.select(this.records,selection);},object:function(){return jLinq.util.select(this.records,selection);},other:function(){return this.records;}});}},{name:"distinct",type:framework.command.select,method:function(field){var groups=jLinq.util.group(this.records,field,this.ignoreCase);return jLinq.util.grab(groups,function(record){return jLinq.util.findValue(record[0],field);});}},{name:"group",type:framework.command.select,method:function(field){return jLinq.util.group(this.records,field,this.ignoreCase);}},{name:"define",type:framework.command.select,method:function(selection){var results=this.when(selection,{method:function(){return jLinq.util.select(this.records,selection);},object:function(){return jLinq.util.select(this.records,selection);},other:function(){return this.records;}});return jLinq.from(results);}},{name:"any",type:framework.command.select,method:function(){return this.records.length>0;}},{name:"none",type:framework.command.select,method:function(){return this.records.length==0;}},{name:"all",type:framework.command.select,method:function(){return this.removed.length==0;}},{name:"first",type:framework.command.select,method:function(fallback){var record=jLinq.util.elementAt(this.records,0);return record==null?fallback:record;}},{name:"last",type:framework.command.select,method:function(fallback){var record=jLinq.util.elementAt(this.records,this.records.length-1);return record==null?fallback:record;}},{name:"at",type:framework.command.select,method:function(index,fallback){var record=jLinq.util.elementAt(this.records,index);return record==null?fallback:record;}},{name:"count",type:framework.command.select,method:function(){return this.records.length;}},{name:"removed",type:framework.command.select,method:function(selection){return this.when(selection,{method:function(){return jLinq.util.select(this.removed,selection);},object:function(){return jLinq.util.select(this.removed,selection);},other:function(){return this.removed;}});}},{name:"where",type:framework.command.select,method:function(compare){var state=this;var matches=[];jLinq.util.each(this.records,function(record){if(compare.apply(state,[record])===true){matches.push(record);}});var query=jLinq.from(matches);if(!this.ignoreCase){query.useCase();}
          return query;}}]);jLinq={alwaysClone:false,ignoreCase:true,command:framework.command,type:framework.type,extend:function(){framework.library.extend.apply(null,arguments);},query:function(collection,params){return library.framework.query(collection,params);},from:function(collection){return framework.library.query(collection,{clone:false});},getCommands:function(){return framework.util.grab(framework.library.commands,function(command){return{name:command.name,typeId:command.type,type:command.type==framework.command.select?"select":command.type==framework.command.query?"query":command.type==framework.command.action?"action":"unknown"};});},util:{trim:framework.util.trim,findValue:framework.util.findValue,elementAt:framework.util.elementAt,regexEscape:framework.util.regexEscape,regexMatch:framework.util.regexMatch,equals:framework.util.equals,group:framework.util.group,reorder:framework.util.reorder,when:framework.util.when,toArray:framework.util.toArray,each:framework.util.each,grab:framework.util.grab,until:framework.util.until,isType:framework.util.isType,getType:framework.util.getType,apply:framework.util.apply,select:framework.util.select,skipTake:framework.util.skipTake}};jlinq=jLinq;jl=jLinq;})();

          const xhr = new XMLHttpRequest();
          xhr.open("GET", "https://cf-uptime-logger.svrtech.workers.dev/");
          xhr.send();
          xhr.responseType = "json";
          xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var data = xhr.response;
              
              var totalDowntime = 0;    
              var downtimes = jlinq.from(data).equals("statusCode", 0).select();
              for (var i = 0; i < downtimes.length; i++) {
                var uptime = jlinq.from(data).equals("statusCode", 1).greater("timestamp", downtimes[i].timestamp).first();
                if (uptime != null) {
                  totalDowntime += uptime.timestamp - downtimes[i].timestamp;
                } else {
                  totalDowntime += new Date().getTime() - downtimes[i].timestamp;
                }
              }
              
              console.log("Total downtime " + totalDowntime + "ms.");
              console.log("Yearly uptime: " + (100 - ((31536000000 / (31536000000 - totalDowntime)) - 1)).toFixed(2) + "%");

              document.getElementById('spnYearlyUptime').innerText = (100 - ((31536000000 / (31536000000 - totalDowntime)) - 1)).toFixed(2) + "%";
            }
          };
          
          (() => {
            const query = window.matchMedia("(prefers-color-scheme: dark)")
            query.addListener(() => {
              setTheme(query.matches ? "dark" : "light")
            })
            if (["dark", "light"].includes(localStorage.theme)) {
              setTheme(localStorage.theme)
            } else {
              setTheme(query.matches ? "dark" : "light")
            }
          })()
          `}
        </script>
      </Head>
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center p-4">
          <div className="flex flex-row items-center">
            <img className="h-8 w-auto" src={config.settings.logo} />
            <h1 className="ml-4 text-3xl">{config.settings.title}</h1>
          </div>
          <div className="flex flex-row items-center">
            {typeof window !== 'undefined' && <ThemeSwitcher />}
            <MonitorFilter active={slash} callback={filterByTerm} />
          </div>
        </div>
        <MonitorStatusHeader kvMonitorsLastUpdate={kvMonitorsLastUpdate} />
        {state.visible.map((monitor, key) => {
          return (
            <MonitorCard
              key={key}
              monitor={monitor}
              data={kvMonitors[monitor.id]}
            />
          )
        })}
        <div className="flex flex-row justify-between mt-4 text-sm">
          <div>
            Powered by{' '}
            <a href="https://workers.cloudflare.com/" target="_blank">
              Cloudflare Workers{' '}
            </a>
            &{' '}
            <a href="https://flareact.com/" target="_blank">
              Flareact{' '}
            </a>
          </div>
          <div>
            <a
              href="https://www.devoplus.com.tr/"
              target="_blank"
            >
              Devoplus
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
