import Vue from 'vue';
import SearchList from "./SearchList.vue";

Vue.config.devtools = true;

new Vue({
    
    components: {'search-list': SearchList},

    data: {
        itemsStrings: ["buba", "zabar", "lido", "srbr", "kundis", "filto", "memis", "kin", "labaurasls", "1mkea", "ridol"],
        itemsObjects: [],
        selected: ""
    },

    mounted() {
        
        setTimeout(function(){
            this.itemsObjects =  [
                    {name: "bonno", key: "D1"},
                    {name: "strik", key: "Z5"},
                    {name: "ordos", key: "L0"},
                    {name: "bouhti", key: "G12"},
                    {name: "nbuod", key: "S1"}
                ]
                
        }.bind(this),3000)

    },
    
   el: "#root"
    
});