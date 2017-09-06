<template>
    <div class="seller" ref="sellerContent">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc">
                    <star :size="36" :score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售{{seller.sellCount}}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="count">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="count">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="count">{{seller.deliveryTime}}</span>元
                        </div>
                    </li>
                </ul>
                <div class="favorite" @click="toggleFavorite">
                    <span class="icon-favorite" :class="{'active':favorite}"></span>
                    <span class="text">{{favoriteText}}</span>
                </div>
            </div>
            <split></split>
            <div class="bulletin">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul class="supports" v-if="seller.supports">
                    <li class="support_item" v-for="(item,index) in seller.supports">
                        <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                        <span class="text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics" v-show="seller.pics">
                <h1 class="title">商家实景</h1>
                <div class="pic-wrapper" ref="picWrapper">
                    <ul class="pic-list" ref="picList">
                        <li class="pic-item" v-for="(pic,index) in seller.pics">
                            <img :src="pic" width="120" height="90" />
                        </li>
                    </ul>
                </div>
            </div>
            <split v-show="seller.pics"></split>
            <div class="info">
                <h1 class="title">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="(info,index) in seller.infos">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import star from '../star/star.vue';
    import split from '../split/split';
    import BScroll from 'better-scroll';
    import {saveToLocal} from '../../common/js/store.js';
    import {loadFromLocal} from '../../common/js/store.js';
    export default{
        props : {
            seller : {
                type : Object
            }
        },
        data(){
            return {
                favorite : (() => {
                    return loadFromLocal(this.seller.id, 'favorite', false)
                })()
            }
        },
        computed : {
            favoriteText(){
                return this.favorite ? "已收藏" : "收藏";
            }
        },
        created(){
            this.classMap = ['decrease','discount','special','invoice','guarantee'];
        },
        mounted(){
            // 页面整体滚动
            this.scroll = new BScroll(this.$refs.sellerContent, {
                click: true
            });
            this.$nextTick(function () {
                if( this.seller.pics ){
                    let picWidth = 120;
                    let margin = 6;
                    let width = (picWidth+margin) * this.seller.pics.length - margin;

                    this.$refs.picList.style.width = width+"px";
                    this.$nextTick(function () {
                        this.picScroll = new BScroll(this.$refs.picWrapper, {
                            scrollX : true,
                            eventPassthrough : 'vertical'
                        });
                    })
                }
            })
        },
        methods : {
            toggleFavorite(event){
                if( !event._constructed ){
                    return;
                }
                this.favorite = !this.favorite;
                saveToLocal( this.seller.id, "favorite", this.favorite );
            }
        },
        components:{
            star,
            split
        }
    };
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .seller{
        position:absolute;
        width:100%;
        top:174px;
        bottom:0;
        left:0;
        overflow:hidden;
        .overview{
            padding:18px;
            position:relative;
            .title{
                margin-bottom: 8px;
                line-height: 14px;
                color:rgb(7,17,27);
                font-size: 14px;
            }
            .desc{
                padding-bottom: 18px;
                font-size: 0;
                position:relative;
                .border-1px(rgba(7,17,27,0.1));
                .star{
                    display:inline-block;
                    margin-right: 8px;
                    vertical-align: top;
                }
                .text{
                    display:inline-block;
                    margin-right: 12px;
                    line-height: 18px;
                    font-size: 10px;
                    vertical-align: top;
                    color:rgb(77,85,93);
                }
            }
            .remark{
                display:flex;
                padding-top: 18px;
                .block{
                    flex:1;
                    text-align: center;
                    border-right: 1px solid rgba(7,17,27,0.1);
                    &:last-child{
                        border:none;
                    }
                    h2{
                        margin-bottom: 4px;
                        line-height: 10px;
                        font-size: 10px;
                        color:rgb(147,153,159);
                    }
                    .content{
                        line-height: 24px;
                        font-size: 10px;
                        color:rgb(7,17,27);
                        .count{
                            font-size: 24px;
                        }
                    }
                }
            }
            .favorite{
                position:absolute;
                width:40px;
                right:18px;
                top:18px;
                text-align: center;
                .icon-favorite{
                    display:block;
                    margin-bottom: 4px;
                    line-height: 24px;
                    font-size: 24px;
                    color:#d4d6d9;
                    &.active{
                        color:rgb(240,20,20);
                    }
                }
                .text{
                    line-height: 10px;
                    font-size: 10px;
                    color:rgb(77,85,93);
                }
            }
        }
        .bulletin{
            padding:18px 18px 0 18px;
            .title{
                margin-bottom: 8px;
                line-height: 14px;
                color:rgb(7,17,27);
                font-size: 14px;
            }
            .content-wrapper{
                padding:0 12px 16px 12px;
                .content{
                    line-height: 24px;
                    font-size: 12px;
                    color:rgb(240,20,20);
                }
            }
            .supports{
                font-size: 0;
                li{
                    position:relative;
                    padding:16px 12px;
                    .borderTop-1px(rgba(7,17,27,0.1));
                    .icon{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        margin-right: 6px;
                        background-size: 16px 16px;
                        background-repeat: no-repeat;
                        vertical-align: top;
                    }
                    .text{
                        line-height: 16px;
                        font-size: 12px;
                        color:rgb(7,17,27);
                        vertical-align: top;
                    }
                    /*this.classMap = ['decrease','discount','special','invoice','guarantee'];*/
                    .decrease{
                        .bgimage('decrease_4');
                    }
                    .discount{
                        .bgimage('discount_4');
                    }
                    .special{
                        .bgimage('special_4');
                    }
                    .invoice{
                        .bgimage('invoice_4');
                    }
                    .guarantee{
                        .bgimage('guarantee_4');
                    }
                }
            }
        }
        .pics{
            padding:18px;
            .title{
                margin-bottom: 12px;
                line-height: 14px;
                color:rgb(7,17,27);
                font-size: 14px;
            }
            .pic-wrapper{
                width:100%;
                overflow:hidden;
                white-space: nowrap;
                .pic-list{
                    font-size: 0;
                    .pic-item{
                        display:inline-block;
                        margin-right: 6px;
                        width:120px;
                        height:90px;
                        &:last-child{
                            margin:0;
                        }
                    }
                }
            }
        }
        .info{
            padding : 18px 18px 0 18px;
            color:rgb(7,17,27);
            font-size: 0;
            .title{
                padding-bottom: 12px;
                line-height: 14px;
                color:rgb(7,17,27);
                font-size: 14px;
            }
            .info-item{
                position:relative;
                padding:16px 12px;
                line-height: 16px;
                font-size: 12px;
                .borderTop-1px(rgba(7,17,27,0.1));
            }
        }
    }
</style>