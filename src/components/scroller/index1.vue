<template>
	<!-- v-touch:swiperight="onSwipeRight"  -->
	<div class="my-content">
		<!-- 内容 -->
    <div :style="[content_style,transition]" class="content vux-fix-safari-overflow-scrolling" ref="content">
	    <slot v-if="!lastParameters.onLoading||content_show"></slot>
			<div v-else class="loading">
				<!-- <spinner type="circles"></spinner> -->
				<!-- <p>页面加载中...</p> -->
			</div>
			<!-- 上拉模块 -->
			<div v-if="lastParameters.loading&&content_show" class="loading-more">
				<!-- <spinner v-show="loadingStatus!=1" type="ios-small"></spinner> -->
				<p>{{loadingText}}</p>
			</div>
			<!-- 上拉模块 end-->
    </div>
		<!-- 内容 end-->
		<!-- 下拉模块 end-->
		<div class="pull-down" v-if="lastParameters.refresh&&content_show" :style="[transition,pull_down]">
			<!-- <img src="" alt="" /> -->
			<p>{{pullDownMsg}}</p>
		</div>
		<!-- 下拉模块 end-->
	</div>
</template>

<script>
export default {
  name: 'vh-scroller',
  mounted () {
    this.$nextTick(() => {
      this.onScroll()
      this.onListeningDrag()
    })
	},
	forward() {
		// this.content_show=true
		if(this.lastParameters.onLoading){
			if(this.history.firstOpen){
				this.content_show=true
			}else {
				this.content_show=false
			}
		}
	},
	back(){
		this.onRecoveryScroll()
	},
	components: {
	},
	data() {
		return {
			pullDownMsg:"下拉刷新",
			loadingStatus:0,//上拉刷新状态:0正常1禁用
			scrollBar:false,//滚动条
			content_scroll_top:0,//内容区滚动位置
			scroll_location:0,//下拉刷新或上拉加载的位置
			is_loading:false,//正在加载
			is_refresh:false,//正在刷新
			transition_time:500,//复位时间 ms
			scroll_damp:0.8,//下拉刷新或上拉加载的阻尼
			is_reset:false,//复位
			drop_down_or_pull_up:false,//是否 下拉刷新或上拉加载
			deviation_location:0,//触发下拉刷新或上拉加载前的偏移位置
			on_refresh_location:60,//下拉刷新的悬停位置
			on_loding_location:60,//上拉加载的悬停位置
			touchstart_location:[0,0],//触控开始的坐标
			clearTimeoutId:false,//定时器
			content_show:false,//内容是否显示
			parameters:{
				bgColor:"#eee",
				refresh:false,
				loading:false,
				onLoading:true
			}
		}
	},
	watch:{

	},
	computed: {
		lastParameters(){
			return Object.assign({}, this.parameters, this.parameter)
		},
		pull_down(){
			return {
				lineHeight:this.on_refresh_location+'px',
				height:this.on_refresh_location+'px',
				top:-this.on_refresh_location+'px'
			}
		},
		transition_reset(){
			if(this.is_reset){
				return "all "+this.transition_time+"ms cubic-bezier(0.25, 0.1, 0.25, 1) 0ms"
			}else {
				return "none"
			}
		},
		content_style(){
				return {
					backgroundColor:this.lastParameters.bgColor
				}
		},
		transition(){
			if((this.drop_down_or_pull_up)){
				return {
					transform: 'translate(0px, '+this.scroll_location+'px) translateZ(0px)',
					transition: this.transition_reset,
					touchAction: "none",
				}
			}else {
				return {}
			}
		},
		loadingText(){
			if(this.loadingStatus==1){
				return "已经是底部了"
			}else {
				return "正在加载更多信息"
			}
		}
	},
	props: {
		parameter:{
			type: Object,
			default:function () {
				return {}
			}
		}
	},
	eventBus:{
		onTransitionAfter(){
			this.content_show=true
		}
	},
	methods: {
		pauseLoading(){
			this.loadingStatus=1
		},
		startLoading(){
			this.loadingStatus=0
		},
		reset(){
			this.endDrag()
		},
		scrollToBottom(){
			this.scrollBottom()
		},
		//记录滚动位置
		onScroll(){
			this.$refs.content.onscroll=(e)=>{
				// console.log(e.target.scrollTop);
				this.scrollBar=true
				this.content_scroll_top=e.target.scrollTop
				if(e.target.clientHeight+e.target.scrollTop>=e.target.scrollHeight-this.on_loding_location){
					this.onStartLoading()
				}
			}
		},
		//上拉加载事件
		onStartLoading(){
			if(!this.is_loading&&(this.loadingStatus!=1)&&this.lastParameters.loading&&this.content_show){
				this.$emit('on-loading')
				this.is_loading=true
			}
		},
		//恢复滚动位置
		onRecoveryScroll(){
			if(this.content_scroll_top){
				this.$refs.content.scrollTop=this.content_scroll_top
			}
		},
		//监听拖动
		onListeningDrag(){
			if(this.lastParameters.refresh){
				//drastart 开始拖动
				this.$refs.content.addEventListener("touchstart", (event)=> {
					this.onDrag(event,0)
				})
				//drag 拖动中
				this.$refs.content.addEventListener("touchmove", (event)=> {
					this.onDrag(event,1)
				})
				//dragend 拖动结束
				this.$refs.content.addEventListener("touchend", (event)=> {
					this.onDrag(event,2)
				})
			}
		},
		//拖动事件
		onDrag(event,type){
			switch (type) {
				case 0:
					this.touchstart_location[0]=event.changedTouches[0].screenX
					this.touchstart_location[1]=event.changedTouches[0].screenY
				break;
				case 1:
					var deltaY=event.changedTouches[0].screenY-this.touchstart_location[1]
					if(this.content_scroll_top==0&&deltaY>0){
						event.preventDefault()
						event.stopImmediatePropagation();
						this.is_reset=false
						this.scroll_location=(deltaY-this.deviation_location)*this.scroll_damp
						this.drop_down_or_pull_up=true
					}else {
						this.deviation_location=deltaY
					}
					if(deltaY>this.on_refresh_location){
						this.pullDownMsg="释放刷新"
					}else {
						this.pullDownMsg="下拉刷新"
					}
				break;
				case 2:
					if(this.scroll_location>this.on_refresh_location){
						this.scroll_location=this.on_refresh_location
						this.deviation_location=-this.on_refresh_location/this.scroll_damp
						if(!this.is_refresh){
							this.pullDownMsg="拼命加载中..."
							this.$emit('on-refresh')
							this.is_refresh=true
						}
					}else {
						this.endDrag()
					}
					this.is_reset=true
				break;
				default:
			}
		},
		//结束上拉或下拉
		//恢复正常位置
		endDrag(){
			this.scroll_location=0
			this.deviation_location=0
			if(this.clearTimeoutId){
				clearTimeout(this.clearTimeoutId);
			}
			this.clearTimeoutId=setTimeout(()=>{
				this.is_refresh=false
				this.is_loading=false
				this.drop_down_or_pull_up=false
			},this.transition_time)
		},
		//动画滚动到指定位置
		scrollTo(location){
			this.is_reset=true
			this.drop_down_or_pull_up=true
			this.scroll_location=location
		},
		//滚动到底部
		scrollBottom(){
			this.$nextTick(()=>{
				this.$refs.content.scrollTop = this.$refs.content.scrollHeight;
			})
		}
	}
}
</script>
<style scoped>
	.pull-down,
	.pull-top {
		text-align: center;
		width: 100%;
		position: absolute;
		background-color: #fff;
	}
	.pull-down img,
	.pull-top img {
		height: 100%;
		margin: auto;
	}

	.content {
    box-sizing: border-box;
		position: absolute;
    top: 0px;
    bottom: 0px;
		width: 100%;
		touch-action: pan-y;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		/* user-zoom: none; */
		-webkit-user-drag: none;
		/*-webkit-overflow-scrolling: auto; 当手指从触摸屏上移开，滚动会立即停止 */
		/*z-index: 0;*/
	}
	.loading {
		text-align: center;
		margin-top: 30%;
		color: #666
	}
	.loading-more {
		/*background: rgba(255,255,255,0.5);*/
		text-align: center;
		height: 50px;
		color: #666;
		display: flex;
		justify-content: center;
		align-items:center;
	}
	.loading-more p {
		height: 28px;
		line-height: 28px;
	}
</style>
