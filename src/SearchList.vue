<template>

    <div>  
        <input ref="searchInput" 
               type="text" 
               class="search form-control" 
               :name="name"
               v-model="searchString" 
               @focus="focusInput" 
               @blur="blurInput" 
               @keydown="keyDownHub($event.key, $event)"> 

        <div class="list-container-wrapper">
            <ul class="list-container list-group" v-if="displayListContainer" ref="listContainer" style="position:relative">
                <list-item  v-for="(item, index) in matches" 
                            :key="index" 
                            :id="index"
                            :isActive="index === activeChild" 
                            @mousedown.native="clickSelect($event.target, item)">

                    <slot :item="item">{{ item }}</slot>

                </list-item>
            </ul>
        </div>
    </div>
    
</template>

<script>

import ListItem from './ListItem.vue';

export default {
 
  props: {
      items: {
          type: Array,
          default: function() {
              return [];
          }
      },
      name: {
          type: String
      }
  },

  components: {'list-item': ListItem},

    data: function() {

        return {
            searchString: "", 
            displayListContainer: false, 
            activeChild: null,
            matches: this.items 
        };

    },



    methods: {

        findMatches() {

            this.$nextTick(function() {

            if(!this.searchString) {
                
                this.matches = this.items;
                this.activeChild = null;
                
            } else {
         
                this.matches = this.items;

                this.$nextTick(function() {

                    let matching = this.$children.filter(child => {

                        if (child.$el.textContent.toLowerCase().includes(this.searchString.toLowerCase())) {
                            return true;
                        }
                    
                    });
          
                    this.matches = matching.map(child => this.items[child.id]);

                    this.activeChild = this.matches.length > 0 ? 0 : null;

                }.bind(this));
            
                
                
            }
            }.bind(this));

        },


        focusInput() {

            this.displayListContainer = true;
            this.$refs.searchInput.select();
            this.matches = this.items;
    

        },

        blurInput() {

            this.displayListContainer = false;
            this.activeChild = null;
        },

        moveSelectionDown() {

            if(this.matches.length === 0) {
                return;
            }
          
            this.displayListContainer = true;

            this.$nextTick(function() {
                if (this.activeChild === null || this.activeChild < 0) {
                    
                    this.activeChild = 0;


                } else {
                    
                    this.activeChild++;


                }

                if(this.activeChild >= this.matches.length - 1) {
                    this.activeChild = this.matches.length -1;
                }

                this.updateSelection();

            }.bind(this));

        },

        moveSelectionUp() {

            if(this.matches.length === 0) {
                return;
            }

            this.activeChild--;

            if(this.activeChild <= -1) {
                this.activeChild = -1;
                this.displayListContainer = false;
                return;
            }

            this.updateSelection();

        },


        updateSelection() {

           
            let selectedItem = this.$children[this.activeChild].$el;

            if(selectedItem) {

                let childOffset = selectedItem.offsetTop;
                let childHeight = selectedItem.offsetHeight;
                let containerHeight = this.$refs.listContainer.offsetHeight;
                let containerScrollPosition = this.$refs.listContainer.scrollTop
          
                let containerTop = containerScrollPosition;
                let containerBottom = containerHeight + containerScrollPosition - childHeight;
                

                if(childOffset + childHeight > containerBottom) {

                    this.$refs.listContainer.scrollTop = containerScrollPosition + childHeight;

                } 
                else if (childOffset < containerTop) {
                    
                    this.$refs.listContainer.scrollTop = childOffset;
                    
                }
            }



        },

        enterSelect() {
            
            if(this.activeChild !== null && this.activeChild != -1) {

            
                let selectedChild = this.$children[this.activeChild];
                this.$emit('selected', this.matches[this.activeChild]);
                this.searchString = selectedChild.$el.innerText;


                this.displayListContainer = false;
                this.activeChild = null;

            }

        },
        
        clickSelect(target, item) {

            this.searchString = target.innerText;

            this.$emit('selected', item);

            this.displayListContainer = false;
         
            

        },
        
        keyDownHub(key, event) {
       
            switch(key) {
                
                case 'ArrowUp':
                    this.moveSelectionUp();
                    break;
                
                case 'ArrowDown':
                    this.moveSelectionDown();
                    break;
                
                case 'Enter':
                    event.preventDefault();
                    this.enterSelect();
                    break;

                case 'Escape':
                    this.displayListContainer = false;
                    this.activeChild = 0;
                    break;
                
                default:
                    this.displayListContainer = true;
                    this.findMatches();
                    break;
            }
            
        },
    },

    watch: {
            items: function() {
                this.findMatches();
            }
        }

}
</script>

<style scoped>

    .list-container {
            position: absolute;
            bottom: 0;
            height: auto;
            max-height: 400px;
            overflow-y: scroll;
            border-radius: 0.25rem;
            border-bottom: 1px solid rgba(0,0,0,.125)
            
        }

    .list-container-wrapper {
        position: relative;
        height: 0;
    }

</style>


