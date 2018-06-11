import {expect} from 'chai';
import {mount} from '@vue/test-utils';
import SearchList from '../src/SearchList.vue';
import Vue from 'vue';

 

describe('Search List', function() {
    
    it('is initialized with the correct attributes', function() {
        
        let wrapper = mount(SearchList);
        
        expect(wrapper.vm.searchString).to.equal("", "searchString");
        expect(wrapper.vm.displayList).to.equal(false, "displayList");
        expect(wrapper.vm.activeChild).to.equal(null, "activeChild");
        expect(wrapper.vm.matches).to.be.an('array').that.is.empty;

    });

    it('takes an array of items as a prop', function() {

        let wrapper = mount(SearchList, {
            propsData: {
                items: ['Foo', 'Bar']
            }
        });
        
        expect(wrapper.vm.items).to.be.an('array').that.has.members(['Foo', 'Bar']);

    });

    it('takes a name attribute as a prop', function() {

        let wrapper = mount(SearchList, {
            propsData: {
                name: "foobar"
            }
        });
        
        expect(wrapper.props().name).to.equal("foobar");
        expect(wrapper.find('input').attributes().name).to.equal('foobar');

    });

    it('optionally takes an initial value as a prop', function() {

        let wrapper = mount(SearchList, {
            propsData: {
                value: "foobar"
            }
        });

        expect(wrapper.props().value).to.equal('foobar');
        expect(wrapper.find('input').element.value).to.equal('foobar');

    });



    it('finds matching strings from an array', function(done) {
        
        let wrapper = mount(SearchList, {
            propsData: {
                items: ['foo', 'bar', 'baz']
            }
        });

        let input = wrapper.find('input');
        input.element.value = "foo";
        input.trigger('input');
        input.trigger('keydown');
        
        Vue.config.errorHandler = done
        Vue.nextTick(function () {
            Vue.nextTick(function() {
            
                expect(wrapper.vm.matches).to.be.an('array').that.has.members(['foo']);
                done();
            })
        });
        

    });

});
