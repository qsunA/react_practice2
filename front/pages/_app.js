import React from 'react';
import AppLayout from "../components/AppLayout";
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Provider, useStaticRendering } from 'mobx-react';
import App,{ Container }  from 'next/app';

import * as getStores from '../stores';
import { configure } from 'mobx';
import { withMobx } from 'next-mobx-wrapper';
import axios from 'axios';

const isServer = !process.browser;

configure({enforceActions:'observed'});
useStaticRendering(isServer);

class NodeBird extends App{

    static async getInitialProps({Component,ctx}){
        let pageProps = {};
        const user = ctx.store.userStore.user;
        const cookie = isServer? ctx.req.headers.cookie:'';
        if(isServer && cookie){
            axios.defaults.headers.Cookie = cookie; // ssr을 위해서 쿠키를 넣어준
        }
        
        if(!user){
            await ctx.store.userStore.loadUser();
        }    
        
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx) || {};
        }
        return {pageProps};
    }

    render(){
        const {Component, pageProps,store} = this.props;
        return(
            <Container>
                <Helmet
                    title="NodeBird"
                    htmlAttributes ={{lang :'ko'}}
                    meta={[{
                            charset:'UTR-8'
                        },{
                            name:'viewport', content:'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover'                                
                        },{
                            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
                        },{
                            name:'description',content : 'Qsun의 sns',
                        },{
                            name:'og:title', content:'Nodebird'
                        },{
                            name:'og:description', content : 'Qsun의 sns',
                        },{
                            property:'og:type', content:'website'
                        }
                    ]}
                    link = {[
                        {
                            rel:'stylesheet', href:"https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
                        },{
                            rel:'stylesheet', href:"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
                        },{
                            rel:'stylesheet', href:"https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
                        }
                    ]}
                />   
                <Provider {...store}>                                     
                    <AppLayout>
                        <Component {...pageProps}/>
                    </AppLayout>
                </Provider>
            </Container>
        );
    }
}

export default withMobx(getStores)(NodeBird);

// NodeBird.getInitialProps = async(context)=>{
//     console.log(context);
//     const {ctx,Component} = context;
//     ctx.store= store;
//     let pageProps = {};
//     if(Component.getInitialProps){
//         pageProps = await Component.getInitialProps(ctx);
//     }
//     return {pageProps};
// }

// NodeBird.propTypes ={
//     Component : PropTypes.elementType.isRequired,// jsx 에 들어갈 수 있는 모든 것을 node라고 한다. 
//     pageProps : PropTypes.object.isRequired
// }