{
    // API docs    - https://www.reddit.com/r/ 
    // API example - https://www.reddit.com/r/{param}.json, i.g. param = askreddit

    // Variables
    const baseURL = "https://www.reddit.com/r";
    let current_page = 1;
    let records_per_page = 1;
    let postsArr = [];

    // Elements and listeners
    const $btnPrev = document.querySelector("#btn-prev");
    $btnPrev.addEventListener("click", prevPage);
    const $btnNext = document.querySelector("#btn-next");
    $btnNext.addEventListener("click", nextPage);
    const $posts = document.querySelector("#posts");
    const $page_span = document.querySelector("#page");
    const $pagination = document.querySelector("#pagination");
    const $lookup = document.querySelector("#lookup-field");
    const $searchBtn = document.querySelector("#search");
    $searchBtn.addEventListener("click", search);
    const $searchIndicator = document.querySelector("#search-indicator");

    // Functions
    function prevPage() {
        if (current_page > 1) {
            current_page--;
            changePage(current_page);
        }
    }

    function nextPage() {
        if (current_page < numPages()) {
            current_page++;
            changePage(current_page);
        }
    }

    const changePage = page => {
        // Validate page
        if (page < 1) page = 1;
        if (page > numPages()) page = numPages();

        // Initialize content
        $posts.innerHTML = "";
        for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < postsArr.length; i++) {
            $posts.innerHTML += postsArr[i].innerHTML + "<br>";
        }
        $page_span.innerHTML = page;

        // Show/Hide prev/next buttons
        $btnPrev.style.visibility = page == 1 ? "hidden" : "visible";
        $btnNext.style.visibility = page == numPages() ? "hidden" : "visible";
    }

    // Calculates the page number
    const numPages = () => {
        return Math.ceil(postsArr.length / records_per_page);
    }

    // Creates each post dynamically with the following attributes: thumbnail, URL, title, user, votes (ups) and nicely formatted timestamp
    const createPost = post => {
        const $container = document.createElement("div")
        createAttribute($container, "Thumbnail", post.thumbnail);
        createAttribute($container, "URL", post.url);
        createAttribute($container, "Title", post.title);
        createAttribute($container, "User", post.user_reports);
        createAttribute($container, "Votes", post.upvote_ratio);
        createAttribute($container, "Date", post.created);
        return $container;
    }

    // Creates attributes 
    const createAttribute = ($container, attr, value) => {
        const $element = document.createElement("div");
        $element.classList.add(attr.toLowerCase());
        switch (attr) {
            case "Thumbnail":
                $element.innerHTML = value && typeof value == "string" ? `<b>${attr}:</b> <a href=${value.trim()}>${value.trim()}</a>` : "";
                break;
            case "URL":
                $element.innerHTML = value && typeof value == "string" ? `<b>${attr}:</b> <a href=${value.trim()}>${value.trim()}</a>` : "";
                break;
            case "User":
                $element.innerHTML = value && value.length > 0 ? `<b>${attr}:</b> ${value[0]}` : "";
                break;
            case "Date":
                $element.innerHTML = value && typeof value == "number" ? `<b>${attr}:</b> ${new Date(value * 1000).toLocaleDateString()}` : "";
                break;
            default:  $element.innerHTML = value ? `<b>${attr}:</b> ${value}` : "";
        }
        $container.append($element);
    }

    // Validate the petch response
    const validateResponse = async res => {
        const payload = await res.json();
        if (!res.ok || "message" in payload) {
            throw payload;
        }
        return payload;
    }

    // Creates posts dynamically from the payload data
    const createPosts = payload => {
        postsArr = [];
        current_page = 1;
        records_per_page = 1;
        const payloadChilderns = payload.data.children;

        payloadChilderns.forEach(({ data }) => {
            postsArr.push(createPost(data));
        })

        changePage(1);
        $pagination.style.visibility = "visible";
        $posts.style.visibility = "visible";
    }

    // Indicate to the user that the request is loading
    const startLoadingAnimation = () => $searchIndicator.classList.remove("inactive-search-indicator");

    // Indicate to the user that the request had finished
    const stopLoadingAnimation = () => $searchIndicator.classList.add("inactive-search-indicator");

    // Fetches the user's input from the API and creates posts
    function search() {
        const searchTerm = $lookup.value;

        if (!searchTerm) {
            console.log("Cannot search an empty string");
            return;
        }

        startLoadingAnimation();

        fetch(`${baseURL}/${searchTerm}.json`)
            .finally(() => stopLoadingAnimation())
            .then(validateResponse)
            .then(createPosts)
            .catch(reason => console.log(reason.message))
    }
}