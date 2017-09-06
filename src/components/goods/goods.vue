<template>
    <div class="goods">
        <div class="menu_wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu_item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
                    <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods_wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food_list food_list_hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food_item">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" alt="" />
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <price :food="food"></price>
                                <div class="carcontrol_wrapper">
                                    <carcontrol :food="food"></carcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcar 
            :delivery-price="seller.deliveryPrice" 
            :min-price="seller.minPrice" 
            :select-foods="selectFoods"
            ref="shopcar"
        >
        </shopcar>
        <food :food="selectedFood" ref="foodDetail"></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import shopcar from '../shopcar/shopcar';
    import carcontrol from '../carcontrol/carcontrol';
    import Bus from '../../common/js/eventBus';
    import food from '../food/food';
    import price from '../price/price';

    const ERR_OK = 0;
    export default{
        props : {
            seller : {
                type : Object
            }
        },
        data(){
            return {
                goods : [],
                listHeight : [],
                scrollY : 0,
                selectedFood : {}
            }
        },
        computed:{
            currentIndex(){
                for (var i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];

                    if( height2 && ( this.scrollY >= height1 && this.scrollY < height2 ) ){
                        return i
                    }
                };
                return 0;
            },
            selectFoods(){
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food)=>{
                        if( food.count ){
                            foods.push(food);
                        }
                    })
                })
                return foods;
            }
        },
        created(){
            this.classMap = ['decrease','discount','special','invoice','guarantee'];

            this.$http.get("/api/goods").then(
                function (res) {
                    // console.log(res)
                    // 处理成功的结果
                    var result = res.body;
                    this.goods = result.data||{};
                    this.$nextTick( () =>{
                        this._initScroll();
                        this._calculateHeight();
                    })

                },function (res) {
                // 处理失败的结果
                }
            )
            Bus.$on('cart.add', el => {
                this.$nextTick(() => {
                    this.$refs.shopcar.drop(el);
                })
            });
        },
        methods : {
            _initScroll(){
                this.menuScroll = new BScroll( this.$refs.menuWrapper,{
                    click : true
                });

                this.foodsScroll = new BScroll( this.$refs.foodsWrapper,{
                    probeType : 3,
                    click : true
                });

                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs( Math.round(pos.y) );
                });
            },
            _calculateHeight(){
                let foodList = this.$refs.foodsWrapper.getElementsByClassName("food_list_hook");
                let height = 0;

                this.listHeight.push( height );

                for( let i=0;i<foodList.length;i++ ){
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push( height );
                }
            },
            selectMenu(index,event){
                if( !event._constructed ){
                    return;
                }

                let foodList = this.$refs.foodsWrapper.getElementsByClassName("food_list_hook");
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el,300);
            },
            selectFood(food,event){
                if( !event._constructed ){
                    return;
                }
                this.selectedFood = food;
                this.$refs.foodDetail.show();
            }
        },
        components:{
            shopcar,
            carcontrol,
            food,
            price
        }
    };
</script>

<style lang="less">
    @import "../../common/css/base.less";
    .goods{
        display:flex;
        position:absolute;
        width:100%;
        top:174px;
        bottom:46px;
        overflow:hidden;
        .menu_wrapper{
            flex: 0 0 80px;
            width:80px;
            background:#f3f5f7;
            .menu_item{
                display:table;
                height:54px;
                width:56px;
                line-height: 14px;
                padding:0 12px;
                .text{
                    position:relative;
                    display:table-cell;
                    width:56px;
                    vertical-align: middle;
                    font-size: 12px;
                    .border-1px(rgba(7,17,27,0.1));
                }
                .icon{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-right: 2px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    vertical-align: top;
                }
                .decrease{
                    .bgimage('decrease_3');
                }
                .discount{
                    .bgimage('discount_3');
                }
                .special{
                    .bgimage('special_3');
                }
                .invoice{
                    .bgimage('invoice_3');
                }
                .guarantee{
                    .bgimage('guarantee_3');
                }
            }
            .current{
                font-weight: 700;
                margin-top: -1px;
                background:#fff;
                z-index: 30;
                .border-none();
            }
        }
        .foods_wrapper{
            flex:1;
            .title{
                padding-left:14px;
                height:26px;
                line-height: 26px;
                border-left: 2px solid #d9dde1;
                background:#f3f5f7;
                font-size: 12px;
                color:rgb(147,153,159);
            }
            .food_item{
                display:flex;
                position:relative;
                margin:18px;
                padding-bottom: 18px;
                .border-1px(rgba(7,17,27,0.1));
                &:last-child{
                    .border-none();
                    margin-bottom: 0;
                }
                .icon{
                    flex: 0 0 57px;
                    margin-right: 10px;
                }
                .content{
                    flex:1;
                    .name{
                        height:14px;
                        line-height: 14px;
                        margin:2px 0 8px 0;
                        font-size: 14px;
                        color:rgb(7,17,27);
                    }
                    .desc,.extra{
                        line-height: 10px;
                        font-size: 10px;
                        color:rgb(147,153,159);
                        margin-bottom: 8px;
                    }
                    .extra{
                        .count{
                            margin-right: 12px;
                        }
                    }
                    
                    .carcontrol_wrapper{
                        position:absolute;
                        right:0;
                        bottom:12px;
                    }
                }
            }
        }
    }
</style>