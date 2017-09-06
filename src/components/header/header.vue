<template>
	<div class="header">
		<div class="content-wrapper">
		    <div class="avatar">
		        <img :src="seller.avatar" width="64" height="64" />
		    </div>
		    <div class="content">
		        <div class="title">
		            <span class="brand"></span>
		            <span class="name">{{seller.name}}</span>
		        </div>
		        <div class="description">
		            {{seller.description}}/{{seller.deliveryTime}}分钟送达
		        </div>
		        <div v-if="seller.supports" class="support">
		            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
		            <span class="text">{{seller.supports[0].description}}</span>
		        </div>
		    </div>
		    <div class="support-count" v-if="seller.supports" @click="showDetail">
		        <span class="count">{{seller.supports.length}}个</span><i class="icon-keyboard_arrow_right"></i>
		    </div>
		</div>
		<div class="notice-wrapper" @click="showDetail">
		    <span class="notice_title"></span><span class="notice_text">{{seller.bulletin}}</span>
		    <i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
		    <img :src="seller.avatar" width="100%" />
		</div>
        <transition name="fade">
            <div v-show="detailShow" class="detail" @click="hideDetail">
                <div class="detail_wrapper clearfix">
                    <div class="detail_main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star_wrapper">
                            <star :size="48" :score="seller.score"></star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul class="supports" v-if="seller.supports">
                            <li class="support_item" v-for="(item,index) in seller.supports">
                                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                                <span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="notice">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail_close">
                    <i class="icon-close" @click="hideDetail"></i>
                </div>
            </div>    
        </transition>
        
	</div>
</template>

<script>
    import star from '../star/star.vue';
    export default{
        props : {
            seller : {
                type : Object
            }
        },
        data(){
            return {
                detailShow : false
            }
        },
        methods : {
            showDetail(){
                this.detailShow = true;
            },
            hideDetail(){
                this.detailShow = false;
            }
        },
        created(){
            this.classMap = ['decrease','discount','special','invoice','guarantee'];
        },
        components : {
            star
        }
    }
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .header{
        color:#fff;
        position:relative;
        background: rgba(7,17,27,0.5);
        overflow: hidden;
        .content-wrapper{
            position:relative;
            padding:24px 12px 18px 24px;
            font-size: 0px;
            .avatar,.content{
                display: inline-block;
            }
            .avatar{
                vertical-align: top;
                img{
                    border-radius: 2px;
                }
            }
            .content{
                font-size: 14px;
                margin-left: 16px;
                .title{
                    margin:2px 0 8px 0;
                    .brand{
                        display: inline-block;
                        width: 30px;
                        height: 18px;
                        vertical-align:top;
                        .bgimage('brand');
                        background-size: 30px 18px;
                        background-repeat: no-repeat;
                    }
                    .name{
                        font-size: 16px;
                        color:#fff;
                        font-weight: bold;
                        line-height: 18px;
                    }
                }
                .description{
                    margin-top: 8px;
                    font-size: 12px;
                }
                .support{
                    margin-top: 10px;
                    font-size: 0;
                    .icon{
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 4px;
                        background-size: 12px 12px;
                        background-repeat: no-repeat;
                        vertical-align: top;
                    }
                    .text{
                        line-height: 12px;
                        font-size: 10px;
                    }
                    /*this.classMap = ['decrease','discount','special','invoice','guarantee'];*/
                    .decrease{
                        .bgimage('decrease_1');
                    }
                    .discount{
                        .bgimage('discount_1');
                    }
                    .special{
                        .bgimage('special_1');
                    }
                    .invoice{
                        .bgimage('invoice_1');
                    }
                    .guarantee{
                        .bgimage('guarantee_1');
                    }
                }
            }
            .support-count{
                position:absolute;
                right:12px;
                bottom:14px;
                font-size: 0px;
                line-height: 12px;
                padding:0px 8px;
                height:24px;
                line-height: 24px;
                background: rgba(0,0,0,0.2);
                color:#fff;
                border-radius: 14px;
                .count{
                    font-size: 10px;
                }
                .icon-keyboard_arrow_right{
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    margin-left: 2px;
                    text-align: center;
                    line-height: 24px;
                    vertical-align: top;
                    font-size: 10px;
                }
            }
        }
        .notice-wrapper{
            position: relative;
            height:28px;
            line-height: 28px;
            padding:0 22px 0 12px;
            background-color: rgba(7,17,27,0.2);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .notice_title{
                display: inline-block;
                width:22px;
                height:12px;
                .bgimage('notice');
                background-size: 22px 12px;
                background-repeat: no-repeat;
                margin-top: 8px;
                vertical-align: top;
            }
            .notice_text{
                font-size: 10px;
                margin-left: 4px;
                vertical-align: top;
            }
            .icon-keyboard_arrow_right{
                position:absolute;
                font-size: 10px;
                right:12px;
                top:8px;
            }
        }
        .background{
            position: absolute;
            z-index: -1;
            top:0;
            bottom:0;
            left:0;
            right:0;
            filter: blur(10px);
            img{
                transform: scale(0.65,0.9);
            }
        }
        .detail{
            position:fixed;
            z-index: 100;
            top:0;
            left:0;
            width:100%;
            height:100%;
            overflow:auto;
            background:rgba(7,17,27,0.8);
            transition: all 0.5s;
            opacity: 1;
            /*backdrop-filter: blur(10px); ios 模糊背景*/
            .detail_wrapper{
                min-height: 100%;
                width:100%;
                .detail_main{
                    margin-top: 64px;
                    padding-bottom: 64px;
                    .name{
                        line-height: 16px;
                        font-size: 16px;
                        font-weight: 700;
                        text-align: center;
                    }
                    .star_wrapper{
                        margin-top: 16px;
                        padding:2px 0;
                        text-align: center;
                    }
                    .title{
                        display:flex;
                        width:80%;
                        margin: 28px auto 24px auto;
                        .line{
                            flex:1;
                            position:relative;
                            top:-6px;
                            border-bottom: 1px solid rgba(255,255,255,0.2);
                        }
                        .text{
                            padding:0 12px;
                            font-weight: 700;
                            font-size: 14px;
                        }
                    }
                    .supports{
                        width:80%;
                        margin:0 auto;
                        .support_item{
                            padding:0 12px;
                            margin-bottom: 12px;
                            font-size: 0;
                            .icon{
                                display:inline-block;
                                width:16px;
                                height:16px;
                                vertical-align: top;
                                margin-right: 6px;
                                background-size:16px;
                                background-repeat: no-repeat;
                            }
                            .text{
                                font-size: 12px;
                                line-height: 16px;
                            }
                            .decrease{
                                .bgimage('decrease_2');
                            }
                            .discount{
                                .bgimage('discount_2');
                            }
                            .special{
                                .bgimage('special_2');
                            }
                            .invoice{
                                .bgimage('invoice_2');
                            }
                            .guarantee{
                                .bgimage('guarantee_2');
                            }
                        }
                        .support_item:last-child{
                            margin-bottom: 0
                        }
                    }
                    .notice{
                        width:80%;
                        margin:0 auto;
                        .content{
                            padding:0 12px;
                            font-size: 12px;
                            line-height: 24px;
                        }
                    }
                }
            }
            .detail_close{
                position:relative;
                width:32px;
                height:32px;
                margin: -64px auto 0 auto;
                clear:both;
                font-size: 32px;
                color:rgba(255,255,255,0.5);
            }
            &.fade-enter, &.fade-leave-active {
                opacity: 0
            }
        }
        // .fade-enter-active {
        //     animation: fade-in .5s;
        // }
        // .fade-leave-active {
        //     animation: fade-out .5s;
        // }
        // @keyframes fade-in {
        //     0% {
        //         transform:translate3D(0,0,0);
        //         opacity:0;
        //     }
        //     100% {
        //         opacity:1;
        //     }
        // }
        // @keyframes fade-out {
        //     0% {
        //         transform:translate3D(0,0,0);
        //         opacity:1;
                
        //     }
        //     100% {
        //         opacity:0;
        //     }
        // }
        
    }
</style>