<template>
    <div class="price">
        <span class="now">￥<span class="num">{{food.price}}</span></span>
        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
    </div>
</template>

<script>
    export default{
        props : {
            food : {
                type : Object
            }
        }
    };
</script>

<style lang="less">
.price{
    font-size: 0;
    line-height: 12px;
    span{
        font-size: 10px;
    }
    .now{
        color:rgb(240,20,20);
        margin-right: 8px;
        .num{
            font-weight: 700;
            font-size: 14px;
        }
    }
    .old{
        color:rgb(147,153,159);
        text-decoration:line-through;
    }
}
</style>