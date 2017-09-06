<template>
    <div class="carcontrol">
        <transition name="slide-fade">
            <div class="car_decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="removeFromCar"></div>
        </transition>
        <div class="car_count" v-show="food.count>0">{{food.count}}</div>
        <div class="car_increase icon-add_circle" @click.stop.prevent="addToCar"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Bus from '../../common/js/eventBus';

    export default{
        props : {
            food : {
                type : Object
            }
        },
        created(){
            
        },
        methods : {
            addToCar(event){
                if( !event._constructed ){
                    return;
                }
                if( !this.food.count ){
                    Vue.set( this.food, 'count', 1 );
                }else{
                    this.food.count++;
                }
                Bus.$emit('cart.add', event.target);
            },
            removeFromCar(event){
                if( !event._constructed ){
                    return;
                }
                if( this.food.count ){
                    this.food.count--;
                }
            }
        }
    };
</script>

<style lang="less">
    .carcontrol{
        font-size: 0;
        div{
            display:inline-block;
        }
        .car_decrease,.car_increase{
            padding:6px;
            line-height: 24px;
            font-size: 24px;
            color:rgb(0,160,220);
        }
        .car_decrease{
            transition: all 0.3s;
            opacity: 1;
            transform:translate3D(0,0,0);
            &.slide-fade-enter-active, &.slide-fade-leave-active {
              transition: all 0.3s
            }
            &.slide-fade-enter, &.slide-fade-leave-active {
                transform:translateX(36px) rotate(-180deg);
                opacity: 0
            }
        }
        .car_count{
            vertical-align: top;
            width:12px;
            padding-top: 6px;
            line-height: 24px;
            text-align: center;
            font-size: 10px;
            color:rgb(147,153,159);
            transition: all 0.3s;
        }
        .car_increase{
            
        }
        
    }
</style>