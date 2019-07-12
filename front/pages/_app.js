import React from 'react';
import AppLayout from "../components/AppLayout";
import PropTypes from 'prop-types';
import Head from "next/head";
import { Provider } from 'mobx-react';
import PostStore from '../stores/PostStore';

const store = new PostStore();

const NodeBird = ({Component})=>{
    return(
        <>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css" />
            </Head>
            <Provider store={store}>
                <AppLayout>
                    <Component/>
                </AppLayout>
            </Provider>
        </>
    )
}

NodeBird.propTypes ={
    Component : PropTypes.elementType// jsx 에 들어갈 수 있는 모든 것을 node라고 한다. 
}

export default NodeBird;