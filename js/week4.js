import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
import pagination from './pagination.js';

//燈入及登入狀態、取得產品列表
const site='https://vue3-course-api.hexschool.io/v2';
const api_path='yuling202202';
let productModal ={};
let delProductModal ={};


const app = createApp({
    components:{
        pagination,
    },
    data(){
        return{
            products:[],
            tempProduct:{
                imagesUrl:[],
            },
            isNew:false,
            pagination:{},
        }
    },
    methods:{
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            console.log(token)

            const url =`${site}/api/user/check`;
            axios.post(url)
            .then(()=>{
               this.getProducts();
            })

        },
        getProducts(page=1){
            const url =`${site}/api/${api_path}/admin/products?page=${page}`;
            axios.get(url)
            .then((res)=>{
                this.products =res.data.products;
                this.pagination =res.data.pagination;
            //    console.log(Object.values(this.products))//物件轉陣列
            //     Object.values(this.products).forEach((item)=>{
            //         //console.log(item)
            //     })
            })

        },
        openModal(status,product){
            console.log(status,product);
            if(status === 'isNew'){
                this.tempProduct={
                    imagesUrl:[],
                }
                productModal.show();
                this.isNew =true;
            }else if( status ==='edit'){
                // 編輯的部分可以加上 imagesUrl this.tempProduct = { imagesUrl: [], ...product };
                this.tempProduct ={imagesUrl: [],...product};
                productModal.show();
                this.isNew =false;
            }else if( status === 'delete'){
                delProductModal.show();
                this.tempProduct ={imagesUrl: [],...product};
            }
                
           
        },
        
       
    },
    mounted(){
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
          })
        delProductModal =new bootstrap.Modal(document.getElementById('delProductModal'));
        //delProductModal.show();
        //   productModal.show();
        //   setTimeout(()=>{
        //       productModal.hide();
        //   },30000)
    }
})

//全域 新增
app.component('productModal',{
    props:['tempProduct'],
    template:'#templateForProductModal',
    methods:{
        updateProduct(){
            let url =`${site}/api/${api_path}/admin/product`;
            let method='post';

            if(! this.isNew){
                 url =`${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                 method='put';
            }
            axios[method](url ,{ data: this.tempProduct })
            .then((res)=>{
                console.log(res)
                //this.getProducts();沒有getPRoduct (外層方法)
                this.$emit('get-product');
                productModal.hide();
                
            })
            // 補上 .catch 來回傳失敗的訊息
            .catch(function (error) {
                console.log(error);
              });
            
        },
    }
})


app.component('delProductModal',{
    template: '#templateDelForProductModal',
    props: ['item'],
    methods:{
        delProduct(){
            let url =`${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
            .then((res)=>{
                console.log(res)

                //this.getProducts();
                this.$emit('get-product');
                delProductModal.hide();
            });
        },
        openModal() {
          delProductModal.show();
        },
        hideModal() {
          delProductModal.hide();
        },
      },
    
})
app.mount('#app');