Vue.component('search-list',{
    
    
    props: ['items'],

    data: function() {

        return {
            searchString: "", 
            displayListContainer: false, 
            activeChild: null, 
        };

    },

    computed: {

        matches: function() {
            
            if(!this.searchString) {
                
                return this.items;
                
            } else {

                return this.items.filter(item => {

                    return item.toLowerCase().includes(this.searchString.toLowerCase());

                });
            }

        },


    },

    template: `<div>
                
                   <input ref="searchInput" type="text" class="search" v-model="searchString" @focus="focusInput" @blur="blurInput" @keydown="keyDownHub($event.key)" class="form-control"> 
              
                   <div>
                        <ul class="list-container list-group" v-if="displayListContainer" ref="listContainer" style="position:relative">

                            <list-item v-for="(item, index) in matches" :key="index" :isActive="index === activeChild" @mousedown.native="clickSelect($event.target)">{{ item }}</list-item>

                        </ul>
                    </div>

                </div>`,
    
    
    methods: {


        focusInput() {

            this.displayListContainer = true;
            this.$refs.searchInput.select();
    

        },

        blurInput() {

            this.displayListContainer = false;
            this.activeChild = null;
        },

        moveSelectionDown() {
          

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

            

            this.activeChild--;

            if(this.activeChild <= 0) {
                this.activeChild = 0;
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
            
            if(this.activeChild !== null) {

                let selectedItem = this.matches[this.activeChild];
                this.searchString = selectedItem


                this.displayListContainer = false;
                this.activeChild = null;

            }

        },
        
        clickSelect(target) {

            this.searchString = target.innerHTML;

            this.displayListContainer = false;
         
            

        },
        
        keyDownHub(key) {
            
            switch(key) {
                
                case 'ArrowUp':
                    this.moveSelectionUp();
                    break;
                
                case 'ArrowDown':
                    this.moveSelectionDown();
                    break;
                
                case 'Enter':
                    this.enterSelect();
                    break;
                
                default:
                    this.displayListContainer = true;
                    this.activeChild = 0;
            }
            
        }



    },


});


Vue.component('list-item', {
    
    props: ['isActive'],

    template: `<li :class="{'list-item': true, 'active' : isActive, 'list-group-item': true}"><slot></slot></li>`,





});
