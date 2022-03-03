import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

//燈入及登入狀態、取得產品列表
const site='https://vue3-course-api.hexschool.io/v2';
const api_path='yuling202202';

const app = createApp({
    data(){
        return{
            cartData:{},
            products:[],

        }
    },
    methods:{
        getProducts(){
            axios.get(`${site}/api/${api_path}/products/all`)
            .then((res)=>{
                console.log(res)
                this.products =res.data.getProducts;
                console.log(res.data.products)
            })
        },
        mounted(){
            this.getProducts();
        },
        openProductModal(){

        }
    }
});

app.component('product-modal',{
    template:'#userProductModal',
    data(){
        return{
            modal:{}
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal)
          
    }
})

app.mount('#app');