// import React from 'react';
// import { mount } from 'enzyme';
// import LoginForm from '../components/LoginForm';
// import { getUserStore } from '../stores/UserStore';
// import { MobXProviderContext } from 'mobx-react';

// const store = getUserStore();

// describe('<LoginForm/>',()=>{
//     it('matches snapshot',()=>{
//         const wrapper = mount(
//             <MobXProviderContext.Provide store={store}>
//                 <LoginForm />
//             </MobXProviderContext.Provide>
//         );
//         expect(wrapper).toMatchSnapshot();
//     });
// });