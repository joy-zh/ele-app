<template>
    <div class="shopcar">
        <div class="content" @click="toggleList">
            <div class="content_left">
                <div class="logo_wrapper">
                    <div class="logo" :class="{'highlight':totalCount>0}">
                        <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content_right" @click.stop.prevent="pay">
                <div class="pay" :class="payClass">{{payDesc}}</div>
            </div>
        </div>
        <div class="ball_container">
            <template v-for="ball in balls">
                <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div v-show="ball.show" class="ball">
                        <div class="inner inner-hook"></div>
                    </div>
                </transition>
            </template>
        </div>
        <transition name="translate">
            <div class="shopcar_list" v-show="listShow">
                <div class="list_header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list_content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span class="money">￥{{food.price*food.count}}</span>
                            </div>
                            <div class="carcontrol_wrapper">
                                <carcontrol :food="food"></carcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="list_mark" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
    
</template>

<script>
    import BScroll from 'better-scroll';
    import carcontrol from '../carcontrol/carcontrol';
    export default{
        props : {
            selectFoods : {
                type : Array,
                default(){
                    return [];
                }
            },
            deliveryPrice : {
                type : Number
            },
            minPrice : {
                type : Number
            }
        },
        data(){
            return {
                balls : [
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    },
                    {
                        show:false
                    }
                ],
                dropBalls : [],
                fold : true
            }
        },
        computed : {
            totalPrice(){
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                })
                return total;
            },
            totalCount(){
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                })
                return count;
            },
            payDesc(){
                if( this.totalPrice === 0 ){
                    return '￥'+this.minPrice+'元起送';
                }else if( this.totalPrice < this.minPrice ){
                    let diff = this.minPrice-this.totalPrice;
                    return '还差￥'+diff+'元起送';
                }else{
                    return '去结算';
                }
            },
            payClass(){
                if( this.totalPrice < this.minPrice ){
                    return 'not-enough'
                }else{
                    return 'enough'
                }
            },
            listShow(){
                if( !this.totalCount ){
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if( show ){
                    this.$nextTick(() => {
                        if( !this.scroll ){
                            this.scroll = new BScroll(this.$refs.listContent,{
                                click:true
                            })
                        }else{
                            this.scroll.refresh();
                        }
                    })
                }
                return show;
            }
        },
        methods:{
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        // 保存el
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter(el){
                let count = this.balls.length;
                while(count--){
                    let ball = this.balls[count];
                    if( ball.show ){
                        let rect = ball.el.getBoundingClientRect();
                        let x = rect.left-10;
                        let y = -(window.innerHeight-rect.top-50);

                        el.style.display = '';
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName("inner-hook")[0];
                        inner.style.display = '';
                        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                        inner.style.transform = `translate3d(${x}px,0,0)`;

                    }
                }
            },
            enter(el){
                let rf = el.offsetHeight;
                this.$nextTick(() =>{
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName("inner-hook")[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                })
            },
            afterEnter(el){
                let ball = this.dropBalls.shift();
                if( ball ){
                    ball.show = false;
                    el.style.display = "none";
                }
            },
            toggleList(){
                if( !this.totalCount ){
                    return;
                }
                this.fold = !this.fold;
            },
            empty(){
                this.selectFoods.forEach((food) =>{
                    food.count = 0;
                })
            },
            hideList(){
                this.fold = true;
            },
            pay(){
                if( this.totalPrice < this.minPrice ){
                    return;
                }
                alert("去支付"+this.totalPrice+"元");
            }
        },
        components:{
            carcontrol
        }
    };
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .shopcar{
        position:fixed;
        left:0;
        bottom:0;
        width:100%;
        height:48px;
        z-index: 90;
        //background:#000;
        .content{
            display:flex;
            background:#141d27;
            .content_left{
                flex:1;
                font-size: 0;
                .logo_wrapper,.price,.desc{
                    display:inline-block;
                }
                .logo_wrapper{
                    position:relative;
                    top:-10px;
                    margin:0 12px;
                    padding:6px;
                    width:56px;
                    height:56px;
                    box-sizing: border-box;
                    vertical-align: top;
                    border-radius: 50%;
                    background:#141d27;
                    .logo{
                        width:100%;
                        height:100%;
                        border-radius: 50%;
                        background:#2b343c;
                        text-align: center;
                        .icon-shopping_cart{
                            font-size: 24px;
                            line-height: 44px;
                            color:#80858a;
                            &.highlight{
                                color:#fff;
                            }
                        }
                        &.highlight{
                            background:rgb(0,160,220);
                        }
                    }
                    .num{
                        position:absolute;
                        top:0;
                        right:0;
                        box-sizing: border-box;
                        width:24px;
                        height:16px;
                        line-height: 16px;
                        font-size: 9px;
                        font-weight: 700;
                        text-align: center;
                        border-radius: 16px;
                        color:#fff;
                        background:rgb(240,20,20);
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
                    }
                }
                .price{
                    vertical-align: top;
                    margin-top: 12px;
                    padding-right: 12px;
                    line-height: 24px;
                    box-sizing: border-box;
                    border-right: 1px solid rgba(255,255,255,0.1);
                    font-size: 16px;
                    font-weight: 700;
                    color:rgba(255,255,255,0.4);
                    &.highlight{
                        color:#fff;
                    }
                }
                .desc{
                    vertical-align: top;
                    margin-top: 12px;
                    margin-left: 12px;
                    line-height: 24px;
                    box-sizing: border-box;
                    font-size: 10px;
                    color:rgba(255,255,255,0.4);
                }
            }
            .content_right{
                flex:0 0 105px;
                width:105px;
                .pay{
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 48px;
                    text-align: center;
                    color:rgba(255,255,255,0.4);
                    &.not-enough{
                        background:#2b343c;
                    }
                    &.enough{
                        background:#00b43c;
                        color:#fff;
                    }
                }
            }
        }
        .ball_container{
            .ball{
                position:fixed;
                left:32px;
                bottom:22px;
                z-index: 200;
                transition:all 0.4s cubic-bezier(0.49,-0.35,0.75,0.41);
                .inner{
                    width:16px;
                    height:16px;
                    border-radius: 50%;
                    background:rgb(0,160,220);
                    transition:all 0.4s linear;
                }
            }
        }
        .shopcar_list{
            position:absolute;
            top:0;
            left:0;
            z-index: -1;
            width:100%;
            transition: all .4s ease;
            transform:translate3d(0,-100%,0);
            &.translate-leave-active,&.translate-enter{
                transform:translate3d(0,0,0);
            }
            .list_header{
                height:40px;
                line-height: 40px;
                padding: 0 18px;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                background:#f3f5f7;
                .title{
                    float:left;
                    font-size: 14px;
                    color:rgb(7,17,27);
                }
                .empty{
                    float:right;
                    font-size: 12px;
                    color:rgb(0,160,220);
                }
            }
            .list_content{
                padding:0 18px;
                max-height: 217px;
                overflow:hidden;
                background:#fff;
                .food{
                    position:relative;
                    padding:12px 0;
                    box-sizing: border-box;
                    .border-1px(rgba(7,17,27,0.1));
                    .name{
                        line-height: 24px;
                        font-size: 14px;
                        color:rgb(7,17,27);
                    }
                    .price{
                        position:absolute;
                        right:90px;
                        bottom:12px;
                        line-height: 24px;
                        font-size: 14px;
                        font-weight: 700;
                        color:rgb(240,20,20);
                    }
                    .carcontrol_wrapper{
                        position:absolute;
                        right:0;
                        bottom:6px;
                    }
                }
            }
        }
    }
    .list_mark{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index: -2;
        background:rgba(7,17,27,0.8);
        opacity: 1;
        &.fade-enter-active, &.fade-leave-active {
            transition: all .4s
        }
        &.fade-enter, &.fade-leave-active {
            opacity: 0
        }
    }
</style>