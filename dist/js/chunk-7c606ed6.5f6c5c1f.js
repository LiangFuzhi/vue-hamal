(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7c606ed6"],{"2ace":function(e,n,t){},"471a":function(e,n,t){"use strict";var o=t("7a23");function c(e,n,t,c,r,u){var a=Object(o["H"])("vh-scroller");return Object(o["z"])(),Object(o["h"])(a,{ref:"vhScroller",onOnLoading:u.onLoading,onOnRefresh:u.onRefresh},{default:Object(o["N"])((function(){return[Object(o["G"])(e.$slots,"default",{sum:r.sum})]})),_:3},8,["onOnLoading","onOnRefresh"])}var r={name:"",mixins:[],components:{},data:function(){return{pagination:{pageNum:1,pageSize:10,total:0},sum:15}},computed:{},props:{},watch:{},created:function(){},mounted:function(){},updated:function(){},filters:{},methods:{onRefresh:function(){var e=this;console.log("触发刷新"),setTimeout((function(){e.sum=15,e.$refs.vhScroller.onReset()}),1e3)},onLoading:function(){var e=this;console.log("触发加载更多"),setTimeout((function(){e.sum>50?e.$refs.vhScroller.onPauseLoading():(e.sum+=10,e.$refs.vhScroller.onRecoveryLoading())}),1e3)}}},u=t("6b0d"),a=t.n(u);const i=a()(r,[["render",c]]);n["a"]=i},dfca:function(e,n,t){"use strict";t.r(n);var o=t("7a23"),c=function(e){return Object(o["C"])("data-v-85f0b41c"),e=e(),Object(o["A"])(),e},r=c((function(){return Object(o["k"])("h1",null,"dragBack: true",-1)}));function u(e,n,t,c,u,a){var i=Object(o["H"])("vhTabel"),s=Object(o["H"])("vh-page");return Object(o["z"])(),Object(o["j"])("div",null,[Object(o["m"])(s,{options:u.options},{"header-right":Object(o["N"])((function(){return[Object(o["k"])("div",{onClick:n[0]||(n[0]=function(){return a.click&&a.click.apply(a,arguments)})},"提交")]})),default:Object(o["N"])((function(){return[Object(o["m"])(i,null,{default:Object(o["N"])((function(){return[r,(Object(o["z"])(),Object(o["j"])(o["b"],null,Object(o["F"])(150,(function(t){return Object(o["k"])("h1",{key:t,onClick:n[1]||(n[1]=function(n){return e.$router.push("/Hello-3")})},Object(o["K"])(u.msg),1)})),64))]})),_:1})]})),_:1},8,["options"])])}var a=t("471a"),i={name:"demo-2",data:function(){return{msg:"Hello Vue 2!",options:{dragBack:!0,backgroundColor:"#eee",header:{title:"页面-2",back:!0,backgroundColor:"#fff",color:"#000"}}}},forward:function(){},components:{vhTabel:a["a"]},methods:{click:function(){this.msg="Hello Vue 2-2!"}}},s=(t("e2c4"),t("6b0d")),l=t.n(s);const f=l()(i,[["render",u],["__scopeId","data-v-85f0b41c"]]);n["default"]=f},e2c4:function(e,n,t){"use strict";t("2ace")}}]);