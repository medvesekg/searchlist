import {expect} from 'chai';
import {mount} from '@vue/test-utils';
import SearchList from '../src/SearchList.vue';
import Vue from 'vue';

 

describe('Search List', function() {
    

    it('displays all elements when search string is empty', function(done) {
        
        let items = ['foo', 'bar', 'baz'];
        let wrapper = mount(SearchList, {
            propsData: {
                items
            }
        });

        let input = wrapper.find('input');
        input.trigger('focus');
        
        Vue.config.errorHandler = done
        Vue.nextTick(function () {
            expect(wrapper.find('ul').element.childNodes.length).to.equal(items.length);
            done();

        });
        

    });

    it('finds elements matching the search string', function(done) {
        
        let items = ['foo', 'bar', 'baz'];
        let wrapper = mount(SearchList, {
            propsData: {
                items
            }
        });

        let input = wrapper.find('input');
        input.element.value = "b";
        input.trigger('input');
        input.trigger('keyup');
 
         
        Vue.config.errorHandler = done
        Vue.nextTick(function () {
        
            expect(wrapper.vm.matches).to.have.members(['bar', 'baz']);
            done();

        });

    });

    it('emits the selected element when clicked', function() {

        let items = ['foo', 'bar', 'baz'];
        let wrapper = mount(SearchList, {
            propsData: {
                items
            }
        });

        let input = wrapper.find('input');
        input.trigger('focus');
        let listItem = wrapper.find('li');
        listItem.trigger('mousedown');

        expect(wrapper.emitted().selected[0]).to.have.members([items[0]]);

    });

    it('allows to traverse elements with arrow keys', function(done) {

        let items = ['foo', 'bar', 'baz'];
        let wrapper = mount(SearchList, {
            propsData: {
                items
            }
        });

        let input = wrapper.find('input');
        input.trigger('focus');
        input.trigger('keyup', {key: 'ArrowDown'});
        input.trigger('keyup', {key: 'ArrowDown'});
        input.trigger('keyup', {key: 'ArrowDown'});
        input.trigger('keyup', {key: 'ArrowUp'});
        
        
        Vue.config.errorHandler = done
        Vue.nextTick(function () {
            
            let listItems = wrapper.findAll('li').wrappers;            
            expect(listItems[1].classes()).to.include('active');
            done();
            

        });  
        

    });


    it('emits the selected item on enter press', function() {

        let items = ['foo', 'bar', 'baz'];
        let wrapper = mount(SearchList, {
            propsData: {
                items
            }
        });

        let input = wrapper.find('input');
        input.trigger('focus');
        input.trigger('keyup', {key: 'ArrowDown'});
        input.trigger('keyup', {key: 'ArrowDown'});
        input.trigger('keyup', {key: "Enter"})

        expect(wrapper.emitted().selected[0]).to.have.members([items[1]]);


    });

});
