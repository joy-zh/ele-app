<template>
    <div class="ratingselect">
        <div class="rating_type">
            <span class="block positive" :class="{'active':selectType===2}"
                @click="select(2,$event)">
                {{desc.all}}<span class="count">{{ratings.length}}</span>
            </span>
            <span class="block positive" :class="{'active':selectType===0}"
                @click="select(0,$event)">
                {{desc.positive}}<span class="count">{{positives.length}}</span>
            </span>
            <span class="block negative" :class="{'active':selectType===1}"
                @click="select(1,$event)">
                {{desc.negative}}<span class="count">{{negatives.length}}</span>
            </span>
        </div>
        <div class="switch" @click="toggleContent($event)" :class="{'on':onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    import Bus from '../../common/js/eventBus';
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;
    export default{
        props : {
            ratings : {
                type : Array,
                default(){
                    return [];
                }
            },
            selectedType : {
                type : Number,
                default : ALL
            },
            onlyContentP : {
                type : Boolean,
                default : false
            },
            desc : {
                type : Object,
                default(){
                    return {
                        all:'全部',
                        positive : '满意',
                        negative : '不满意'
                    }
                }
            }
        },
        data(){
            return{
                selectType : this.selectedType,
                onlyContent : this.onlyContentP
            }
        },
        computed:{
            positives(){
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE
                })
            },
            negatives(){
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE
                })
            }
        },
        methods : {
            select(type,event){
                if( !event._constructed ){
                    return;
                }
                this.selectType = type;
                //console.log(this.selectType);
                Bus.$emit('ratingtype.select', type);
            },
            toggleContent(event){
                if( !event._constructed ){
                    return;
                }
                this.onlyContent = !this.onlyContent;
                Bus.$emit('ratingtype.only', this.onlyContent);
            }
        }
    };
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .ratingselect{
        .rating_type{
            position:relative;
            padding:18px 0;
            margin:0 18px;
            .border-1px(rgba(7,17,27,0.1));
            font-size: 0;
            .block{
                display:inline-block;
                padding:8px 12px;
                margin-right: 8px;
                border-radius: 1px;
                color:rgb(77,85,93);
                font-size: 12px;
                line-height: 16px;
                .count{
                    font-size: 8px;
                    margin-left: 2px;
                }
                &.active{
                    color:#fff;
                }
                &.positive{
                    background:rgba(0,160,220,0.2);
                    &.active{
                        background:rgb(0,160,220);
                    }
                }
                &.negative{
                    background:rgba(77,85,93,0.2);
                    &.active{
                        background:rgb(77,85,93);
                    }
                }
            }
            span{
                
            }
        }
        .switch{
            padding:12px 18px;
            line-height: 24px;
            border-bottom: 1px solid rgba(7,17,27,0.2);
            color:rgb(147,153,159);
            font-size: 0;
            &.on{
                .icon-check_circle{
                    color:#00c850;
                }
            }
            .icon-check_circle{
                display:inline-block;
                margin-right: 4px;
                font-size: 24px;
                vertical-align: top;
            }
            .text{
                display:inline-block;
                font-size: 12px;
                vertical-align: top;
            }
        }
    }
</style>