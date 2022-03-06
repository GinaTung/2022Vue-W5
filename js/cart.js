import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 載入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// 設定
configure({
  generateMessage: localize('zh_TW'),
  //validateOnInput: true, // 此項為true時，輸入文字就會立即進行驗證
});

//燈入及登入狀態、取得產品列表
const site='https://vue3-course-api.hexschool.io/v2';
const api_path='yuling202202';


const app = Vue.createApp({
    data(){
        return{
            cartData:{},
            products:[],
            productId:'',
            isLoadingItem :'',
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
            },
            cart: {},
            
        }
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods:{
        getProducts(){
            axios.get(`${site}/api/${api_path}/products/all`)
            .then((res)=>{
                //console.log(res)
                this.products =res.data.products;
            }).catch((err) => {
                alert(err.data.message);
              });
        },
        openProductModal(id){
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        deleteAllCarts() {
            axios.delete(`${site}/api/${api_path}/carts`)
            .then((res) => {
              alert(res.data.message);
              this.getCart();
            }).catch((err) => {
              alert(err.data.message);
            });
          },
        getCart(){
            axios.get(`${site}/api/${api_path}/cart`)
            .then((res)=>{
                console.log(res)
                this.cartData =res.data.data;
            }).catch((err) => {
                alert(err.data.message);
              });
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
            }).catch((err) => {
                alert(err.data.message);
              });   
        },
        removeCartItem(id){
            this.isLoadingItem =id;
            axios.delete(`${site}/api/${api_path}/cart/${id}`)
            .then((res)=>{
                console.log(res)
                this.getCart();
                this.isLoadingItem='';
            }).catch((err) => {
                alert(err.data.message);
              }); 
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
            }).catch((err) => {
                alert(err.data.message);
              });   
        },
        createOrder() {
            const order = this.form;
            axios.post(`${site}/api/${api_path}/order`, { data: order })
            .then((res) => {
              alert(res.data.message);
              this.$refs.form.resetForm();
              this.getCart();
              console.log(res)
            }).catch((err) => {
              alert(err.data.message);
            });
          },
        //   productCoupon(){
        //     axios.post(`${site}/api/${api_path}/coupon`)
        //     .then((res) => {
        //         if(cartData.total>2000){
                    
        //             alert(res.data.message);
        //             console.log(res)
        //         }
                
        //       }).catch((err) => {
        //         alert(err.data.message);
        //       });
        //   }
    },
    
    mounted(){
        this.getProducts();
        this.getCart();
    }
});

// app.component('VForm', VeeValidate.Form);
// app.component('VField', VeeValidate.Field);
// app.component('ErrorMessage', VeeValidate.ErrorMessage);

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
            }).catch((err) => {
                alert(err.data.message);
              });
        },
        addToCart(){
            // console.log(this.qty)
            this.$emit('add-cart',this.product.id, this.qty)
        },
        submit(){
            alert("訂單建立成功~");
        }
    },
    mounted(){
        //ref="modal"
        this.modal = new bootstrap.Modal(this.$refs.modal)
          
    }
})

app.mount('#app');