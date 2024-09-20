const wordpressAPI = "https://edifice.io/wp-json/wp/v2/posts/?per_page=4";

function dateYMD(d) {
    d = new Date(d);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

// format friendly date
function dateFriendly(d) {
    const toMonth = new Intl.DateTimeFormat("en", { month: "long" });
    d = new Date(d);
    return d.getDate() + " " + toMonth.format(d) + ", " + d.getFullYear();
}

// pad date digits
function pad(v = '', len = 2, chr = '0') {
    return String(v).padStart(len, chr);
  }

// fetch list of WordPress posts
async function getPosts() {
    try {
        const res = await fetch(`${wordpressAPI}&_fields=id,slug,date,title,excerpt,content`),
            json = await res.json();

        //console.log(json);

        // return formatted data
        return json
            .filter((p) => p.content.rendered && !p.content.protected)
            .map((p) => {
                return {
                    slug: p.slug,
                    date: new Date(p.date),
                    dateYMD: dateYMD(p.date),
                    dateFriendly: dateFriendly(p.date),
                    title: p.title.rendered,
                    excerpt: p.excerpt.rendered,
                    content: p.content.rendered,
                };
            });
    } catch (err) {
        console.log(`WordPress API call failed: ${err}`);
        return null;
    }
}

// process WordPress posts
module.exports = async function () {
    const posts = await getPosts();
    //console.log(posts);

    return posts;
};
