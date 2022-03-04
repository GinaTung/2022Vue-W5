import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

//燈入及登入狀態、取得產品列表
const site='https://vue3-course-api.hexschool.io/v2';
const api_path='yuling202202';

const app = createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
        }
    },
    methods:{
        getProducts(){
            axios.get(`${site}/api/${api_path}/products/all`)
            .then((res)=>{
                console.log(res)
                this.products =res.data.products;
            })
        },
        openProductModal(id){
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        getCart(){
            axios.get(`${site}/api/${api_path}/cart`)
            .then((res)=>{
                console.log(res)
                // this.cart =res.data.product;
            })
        }
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
});

app.component('product-modal',{
    props:['id'],
    template:'#userProductModal',
    data(){
        return{
            modal:{},
            product:{}
        }
    },
    watch:{
        id(){
            this.getProduct();
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        getProduct(){
            axios.get(`${site}/api/${api_path}/product/${this.id}`)
            .then((res)=>{
                console.log(res)
                this.product =res.data.product;
            })
        }
    },
    mounted(){
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal)
          
    }
})

app.mount('#app');