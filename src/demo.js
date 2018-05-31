import Vue from 'vue';
import SearchList from "./SearchList.vue";

new Vue({
    
    components: {'search-list': SearchList},

    data: {
        
        
        items: ["buba", "zabar", "lido", "srbr", "kundis", "filto", "memis", "kin", "labaurasls", "1mkea", "ridol"]
        
    },
    
   el: "#root"
    
});