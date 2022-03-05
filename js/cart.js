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
            isLoadingItem :''
        }
    },
    methods:{
        getProducts(){
            axios.get(`${site}/api/${api_path}/products/all`)
            .then((res)=>{
                //console.log(res)
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
                this.cartData =res.data.data;
            })
        },
        addToCart(id , qty=1){//預設顯示數量
            const data ={
                product_id: id,
                qty,
            };
            this.isLoadingItem =id;
            axios.post(`${site}/api/${api_path}/cart`,{data})
            .then((res)=>{
                console.log(res)
                this.getCart();
                this.$refs.productModal.closeModal();
                this.isLoadingItem='';
            })   
        },
        removeCartItem(id){
            this.isLoadingItem =id;
            axios.delete(`${site}/api/${api_path}/cart/${id}`)
            .then((res)=>{
                console.log(res)
                this.getCart();
                this.isLoadingItem='';
            }) 
        },
        updateCartItem(item){
            const data ={
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem =item.id;
            axios.put(`${site}/api/${api_path}/cart/${item.id}`,{data})
            .then((res)=>{
                console.log(res)
                this.getCart();
                this.isLoadingItem='';
            })   
        },
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
            product:{},
            qty:1
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
        closeModal(){
            this.modal.hide();
        },
        getProduct(){
            axios.get(`${site}/api/${api_path}/product/${this.id}`)
            .then((res)=>{
                console.log(res)
                this.product =res.data.product;
            })
        },
        addToCart(){
            // console.log(this.qty)
            this.$emit('add-cart',this.product.id, this.qty)
        }
    },
    mounted(){
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal)
          
    }
})

app.mount('#app');