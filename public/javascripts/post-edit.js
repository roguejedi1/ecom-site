// get post edit form
    let postEditForm = document.getElementById("postEditForm");
// add submit listener
    postEditForm.addEventListener('submit', function(event){
        // find length of uploaded images
        let imageUpload = document.querySelector("#imageUpload").files.length;
        // find length of current images
        let existingImages = document.querySelectorAll(".imageDeleteCheckbox").length;
        // find length of checked images
        let imgDeletions = document.querySelectorAll(".imageDeleteCheckbox:checked").length;
            // can the form be submitted?
            let newTotal = existingImages - imgDeletions + imageUpload;
            if (newTotal > 4){
                event.preventDefault();
                let removalAmt = newTotal - 4;
                alert(`You need to remove ${removalAmt} (more) image${removalAmt == 1 ? '' : 's'}`);
            } 

    });