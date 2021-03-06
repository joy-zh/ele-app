<template>
    <transition name="fade">
        <div class="food" v-show="showFlag" ref="food">
            <div class="food_content">
                <div class="image_header">
                    <img :src="food.image" />
                    <i class="icon-arrow_lift" @click="goback"></i>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sellCount">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <price :food="food"></price>
                    <div class="carcontrol_wrapper">
                        <carcontrol :food="food"></carcontrol>
                    </div>
                    <transition name="fade">
                        <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split></split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品信息</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <split v-show="food.info"></split>
                <div class="ratings">
                    <h1 class="title">商品评价</h1>
                    <ratingselect 
                        :selected-type="selectedType"
                        :only-content-p="onlyContentP"
                        :desc="desc"
                        :ratings="food.ratings">
                    </ratingselect>
                    <div class="rating_wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" class="rating_item">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" :src="rating.avatar" width="12" height="12" />
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span class="icon" :class="{'icon-thumb_up':rating.rateType===0,
                                    'icon-thumb_down':rating.rateType===1}"></span>
                                    {{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no_rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Vue from 'Vue';
    import price from '../price/price';
    import BScroll from 'better-scroll';
    import carcontrol from '../carcontrol/carcontrol';
    import Bus from '../../common/js/eventBus';
    import split from '../split/split';
    import ratingselect from '../ratingselect/ratingselect';
    import {formatDate} from '../../common/js/date.js'

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default{
        props : {
            food : {
                type : Object
            }
        },
        data(){
            return {
                showFlag : false,
                selectedType : ALL,
                onlyContentP : true,
                desc : {
                    all:'全部',
                    positive : '推荐',
                    negative : '吐槽'
                }
            }
        },
        created(){
            var _this = this;
            Bus.$on('ratingtype.select', type => {
                this.selectedType = type;
                // console.log(this.selectedType,"selectTypeppppp");
                this.$nextTick(() => {
                    _this.scroll.refresh();
                });
            });
            Bus.$on('ratingtype.only', only => {
                this.onlyContentP = only;
                // console.log(this.onlyContentP+"onlyContentppppppp");
                this.$nextTick(() => {
                    _this.scroll.refresh();
                });
            });
        },
        filters : {
            formatDate(time){
                let date = new Date(time);
                return formatDate(date,"yyyy-MM-dd");
            }
        },
        methods : {
            show(){
                this.showFlag = true;
                this.selectedType = ALL;
                this.onlyContentP = true;
                this.$nextTick(() => {
                    if( !this.scroll ){
                        this.scroll = new BScroll(this.$refs.food,{
                            click:true
                        })
                    }else{
                        this.scroll.refresh();
                    }
                })
            },
            goback(){
                this.showFlag = false;
            },
            addFirst(event){
                if( !event._constructed ){
                    return;
                }
                Vue.set(this.food,'count',1);
                Bus.$emit('cart.add', event.target);
            },
            needShow(type,text){
                if( this.onlyContentP && !text ){
                    return false;
                }
                if( this.selectedType === ALL ){
                    return true;
                }else{
                    return type === this.selectedType;
                }
            }
        },
        components:{
            price,
            carcontrol,
            split,
            ratingselect
        }
    };
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .food{
        position:fixed;
        top:0;
        left:0;
        bottom:48px;
        z-index:30;
        width:100%;
        background: #fff;
        transition: all 0.35s;
        transform:translate3d(0,0,0);
        &.fade-enter, &.fade-leave-active {
            transform:translate3d(100%,0,0);
        }
        .image_header{
            position:relative;
            width:100%;
            height:0;
            padding-top: 100%;
            img{
                position:absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
            }
            .icon-arrow_lift{
                position:absolute;
                top:10px;
                left:0;
                display:block;
                padding:10px;
                font-size: 20px;
                color:#fff;
            }
        }
        .content{
            padding:18px;
            position:relative;
            .title{
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 700;
                color:rgb(7,17,27);
                line-height: 14px;
            }
            .detail{
                margin-bottom: 18px;
                font-size: 0;
                line-height: 10px;
                height:10px;
                span{
                    display:inline-block;
                    font-size: 10px;
                    color:rgb(147,153,159);
                }
                .sellCount{
                    margin-right: 12px;
                }
            }
            .carcontrol_wrapper{
                position:absolute;
                right:12px;
                bottom:12px;
            }
            .buy{
                position:absolute;
                right:18px;
                bottom:18px;
                z-index: 10;
                height:24px;
                line-height: 24px;
                padding:0 12px;
                box-sizing: border-box;
                border-radius: 12px;
                font-size: 10px;
                color:#fff;
                background:rgb(0,160,220);
                transition: all 0.3s;
                &.fade-enter, &.fade-leave-active {
                    opacity:0;
                }
            }
        }
        .info{
            padding:18px;
            .title{
                line-height: 14px;
                margin-bottom: 6px;
                font-size: 14px;
                font-weight: 400;
                color:rgb(7,17,27);
            }
            .text{
                padding:0 8px;
                line-height: 24px;
                font-size: 12px;
                font-weight: 200;
                color:rgb(77,85,93);
            }
        }
        .ratings{
            padding-top: 18px;
            .title{
                line-height: 14px;
                margin-left: 18px;
                font-size: 14px;
                font-weight: 400;
                color:rgb(7,17,27);
            }
            .rating_wrapper{
                padding:0 18px;
                .rating_item{
                    position:relative;
                    padding:16px 0;
                    .border-1px(rgba(7,17,27,0.1));
                    .user{
                        position:absolute;
                        right:0;
                        top:16px;
                        line-height: 12px;
                        font-size: 0;
                        .name{
                            display:inline-block;
                            vertical-align: top;
                            margin-right: 6px;
                            font-size: 10px;
                            color:rgb(147,153,159);
                        }
                        .avatar{
                            border-radius:50%;
                        }
                    }
                    .time{
                        margin-bottom: 6px;
                        line-height: 12px;
                        font-size: 10px;
                        color:rgb(147,153,159);
                    }
                    .text{
                        line-height: 16px;
                        font-size: 12px;
                        color:rgb(7,17,27);
                        .icon{
                            line-height: 16px;
                            margin-right: 4px;
                            font-size: 12px;
                            &.icon-thumb_up{
                                color:rgb(0,160,220);
                            }
                            &.icon-thumb_down{
                                color:rgb(147,153,159);
                            }
                        }
                    }
                }
                .no_rating{
                    padding:16px 0;
                    font-size: 12px;
                    color:rgb(147,153,159);
                }
            }
        }
        
    }
</style>