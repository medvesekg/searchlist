import {expect} from 'chai';
import {mount} from '@vue/test-utils';
import SearchList from '../src/SearchList.vue';
 

describe('Search List', function() {
    
    it('is initialized with the correct attributes', function() {
        
        let wrapper = mount(SearchList);
        
        expect(wrapper.vm.searchString).to.equal("", "searchString");
        expect(wrapper.vm.displayListContainer).to.equal(false, "displayListContainer");
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

});
