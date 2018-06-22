<template>

    <div>  
        <input ref="searchInput" 
               type="text" 
               class="search form-control"
               autocomplete="off" 
               :name="name"
               v-model="searchString" 
               @focus="focusInput" 
               @blur="blurInput" 
               @keyup="keyUpHub($event)"> 

        <div class="list-container">
            <ul class="search-list list-group" v-if="displayList" ref="list">
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
      /* Can be an array of strings or array of objects. */
      items: {
          type: Array,
          default: function() {
              return [];
          }
      },
      /* Name attribute for the input. */
      name: {
          type: String
      },
      /* Initial value for the input field. Optional. */
      value: {
          type: String,
          default: ""
      },

  },

    components: {
      ListItem
    },

    data: function() {

        return {
            searchString: this.value, 
            displayList: false, 
            activeChild: null, // Used to track which item is highlighted with keyboard arrow up and down keys
            matches: this.items, // Items that match the search string
        };

    },

    mounted() {

    },


    methods: {
        

        /* Finds all items that match the search string */
        findMatches() {

                
            /* If search string is empty set matches to the full list and reset active child */
            if(!this.searchString) {
                
                this.matches = this.items;
                this.activeChild = null;
            
            } else {
                
                this.findMatchesInHTML();            
            }
    

        },

        // Find matching items by comparing rendered html output to the search string
        findMatchesInHTML() {
            
            /* Set matches to the full list of items and wait for it to render  */
            this.matches = this.items;

            this.$nextTick(function() {
                
                /* Find out which items' text matches the search string */
                let matching = this.$children.filter(child => {

                    if (child.$el.textContent.toLowerCase().includes(this.searchString.toLowerCase())) {
                        return true;
                    }
                
                });

                /* Find the actual items that correspond to the text */
                this.matches = matching.map(child => this.items[child.id]);

                /* If any matches were found set the first item to active state, otherwise there is no active item */
                this.activeChild = this.matches.length > 0 ? 0 : null;

            }.bind(this)); 

        },


        /* When user focuses on the input, dispaly the seach list, find any matches, and select
            any text that may be in the input */
        focusInput() {

            this.displayList = true;
            this.$refs.searchInput.select();
            this.findMatches();
    

        },


        /* When user removes focus from input, close the search list and reset the active item */
        blurInput() {

            this.displayList = false;
            this.activeChild = null;
        },


        moveSelectionDown() {

            if(this.matches.length === 0) {
                return;
            }
          
            this.displayList = true;

            if (this.activeChild === null || this.activeChild < 0) {
                
                this.activeChild = 0;


            } else {
                
                this.activeChild++;


            }

            if(this.activeChild >= this.matches.length - 1) {
                this.activeChild = this.matches.length -1;
            }

            this.updateSelection();


        },

        moveSelectionUp() {

            if(this.matches.length === 0) {
                return;
            }

            this.activeChild--;

            if(this.activeChild <= -1) {
                this.activeChild = -1;
                this.displayList = false;
                return;
            }

            this.updateSelection();

        },


        updateSelection() {

           
            let selectedItem = this.$children[this.activeChild].$el;

            if(selectedItem) {

                let childOffset = selectedItem.offsetTop;
                let childHeight = selectedItem.offsetHeight;
                let containerHeight = this.$refs.list.offsetHeight;
                let containerScrollPosition = this.$refs.list.scrollTop
          
                let containerTop = containerScrollPosition;
                let containerBottom = containerHeight + containerScrollPosition - childHeight;
                

                if(childOffset + childHeight > containerBottom) {

                    this.$refs.list.scrollTop = containerScrollPosition + childHeight;

                } 
                else if (childOffset < containerTop) {
                    
                    this.$refs.list.scrollTop = childOffset;
                    
                }
            }



        },

        enterSelect() {
            
            if(this.activeChild !== null && this.activeChild != -1) {

            
                let selectedChild = this.$children[this.activeChild];
                this.$emit('selected', this.matches[this.activeChild]);
                this.searchString = selectedChild.$el.innerText;


                this.displayList = false;
                this.activeChild = null;

            }

        },
        
        clickSelect(target, item) {

            this.searchString = target.innerText;

            this.$emit('selected', item);

            this.displayList = false;
         
            

        },
        
        keyUpHub(event) {
       
            switch(event.key) {
                
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
                    this.displayList = false;
                    this.activeChild = null;
                    break;
                
                default:
                    this.displayList = true;
                    this.findMatches();
                    break;
            }
            
        },

        getNestedProperty(propertyString, object) {
            let props = propertyString.split(/\.|\[([A-Za-z0-9_ ]+)\]/);
            props = props.filter(prop => prop !== "" && prop !== undefined && prop !== null);
            return props.reduce((acc,cur) => {
                if(acc === undefined) return undefined;
                return acc[cur];
                }, object);
        }

    },

    watch: {
            items: function() {
                this.findMatches();
            },
            searchString() {
                this.$emit('input', this.searchString);
            }
        }

}
</script>

<style scoped>

    /* This is the unordered list that holds the search results */
    .search-list {
            position: relative;
            height: auto;
            max-height: 400px;
            overflow-y: scroll;
            border-radius: 0.25rem;
            border-bottom: 1px solid rgba(0,0,0,.125);
            z-index: 100;
            
        }

    /* The container for the list has zero height which prevents the search list from
        affecting the page flow when it appears. Instead it renders above any other elements */
    .list-container {
        height: 0;
    }

</style>


