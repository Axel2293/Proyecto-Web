/* 
    Pagination controller class
    Axel - 5/10/2024
        This class is used to control the pagination of the table
        It has a page number and a function to update the data that is bring paginated
        The function to update data should be able to receive the page number and the items per page

        LEFT TO DO:
            Design of buttons
        */

class paginationController {
    //Get buttons attributes
    constructor(func) {
        this.page = 1;
        this.itemsPerPage = 5;
        this.updateFunction = func;
        this.insertPaginationButtons();
        this.updatePageLabel();

        this.nextButton = document.getElementById("next");
        this.prevButton = document.getElementById("prev");
    }

    nextPage() {
        this.page++;
        this.updateFunction(this.page, this.itemsPerPage);
        this.updatePageLabel();
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.updateFunction(this.page, this.itemsPerPage);
            this.updatePageLabel();
        }
    }

    updatePageLabel() {
        const pageLabel = document.getElementById("pageNumber");
        pageLabel.textContent = `Page ${this.page}`;
    }

    runFunction() {
        console.log('Page: ' + this.page + ' Items per page: ' + this.itemsPerPage);
        this.updateFunction(this.page, this.itemsPerPage);
        this.updatePageLabel();
    }

    setPage(page) {
        this.page = page;
        this.updatePageLabel();
    }

    setItemsPerPage(items) {
        this.itemsPerPage = items;
    }

    insertPaginationButtons() {
        //Obtain the div of data
        const paginationDiv = document.getElementById("sessionsData");
        //Insert the buttons inside a div with id sessionPagination
        const paginationButtons = `
        <div id="sessionPagination" class="pagination">
                        <button class="pagination-btn" id="prev" onclick="pagination.prevPage()" disabled=true>Prev</button>
                        <span class="pagination-number" id="pageNumber">PAGE</span>
                        <button class="pagination-btn" id="next" onclick="pagination.nextPage()" disabled=true>Next</button>
                    </div>
                `;
        //Insert the div as adjacent at end
        paginationDiv.insertAdjacentHTML("afterend", paginationButtons);
    }

    updateActiveButtons(length) {
        if (length < this.itemsPerPage) {
            this.nextButton.disabled = true;
        } else {
            this.nextButton.disabled = false;
        }

        if (this.page == 1) {
            this.prevButton.disabled = true;
        } else {
            this.prevButton.disabled = false;
        }
    }

}

// Create a new instance of the pagination controller
const pagination = new paginationController(showTable);

pagination.runFunction();
