import React from 'react';
import { mount } from 'enzyme';
import UserInfoCom from '../components/UserInfoCom';

const userInfo = {
    Posts : 10, 
    Followings : 2,
    Followers : 5,
    nickname : 'test'
};

describe('<UserInfoCom/>', ()=>{
    it('matches snapshot',()=>{
        const wrapper = mount(<UserInfoCom userInfo={userInfo}/>);
        expect(wrapper).toMatchSnapshot();
    });
    it('renders userInfo',()=>{
        const wrapper = mount(<UserInfoCom userInfo={userInfo}/>);
        expect(wrapper.props().userInfo.Posts).toBe(10);
        expect(wrapper.props().userInfo.nickname).toBe('test');
        const avatar= wrapper.find('Avatar');
        expect(avatar.contains('t')).toBe(true);
    });
})