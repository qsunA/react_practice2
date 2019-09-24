import React from 'react';
import {mount} from 'enzyme';
import PostCardContent from '../components/PostCardContent';

const postContent = 'hello #test';

describe('<PostCardContent/>',()=>{
    it('matches snapshot',()=>{
        const wrapper = mount(<PostCardContent postData={postContent}/>);
        expect(wrapper).toMatchSnapshot();
    });
    it('renders postContent' ,()=>{
        const wrapper = mount(<PostCardContent postData={postContent}/>);
        expect(wrapper.props().postData).toBe('hello #test');
        const link = wrapper.find('Link');
        expect(link.contains('#test')).toBe(true);
    });
});