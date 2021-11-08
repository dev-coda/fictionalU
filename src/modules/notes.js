class myNotes {
  constructor() {
    this.deleteButton = document.querySelector("#my-notes");
    this.editButton = document.querySelector("#my-notes");
    this.updateButton = document.querySelector("#my-notes");
    this.submitButton = document.querySelector(".submit-note");
    this.events();
  }

  events() {
    this.deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.className.match("delete-note") && this.deleteNote(e);
    });
    this.editButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.className.match("edit-note") && this.editNote(e);
    });
    this.updateButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.className.match("update-note") && this.updateNote(e);
    });
    this.submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.className.match("submit-note") && this.createNote(e);
    });
  }
  createNote = (e) => {
    const newPost = {
      status: "publish",
      title: document.querySelector(".new-note-title").value,
      content: document.querySelector(".new-note-body").value,
    };
    const opts = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
      credentials: "same-origin",
      body: JSON.stringify(newPost),
    };

    async function load() {
      const url = universityData.root_url + "/wp-json/wp/v2/note/";

      const obj = await (await fetch(url, opts)).json();
      return obj;
    }
    (async () => {
      try {
        const obj = await load();
        document
          .querySelectorAll(".new-note-title, .new-note-body")
          .forEach((e) => {
            e.value = "";
          });
        const addedPost = document.createElement("li");
        addedPost.innerHTML = `
                    <input readonly class="note-title-field" value='${obj.title.rendered}'>

                    <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                    <textarea readonly class="note-body-field">
${obj.content.raw}
                    </textarea>
                    <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>

          `;
        addedPost.setAttribute("data-id", obj.id);
        document.querySelector("#my-notes").prepend(addedPost);
      } catch (e) {
        console.log(e);
      }
    })();
  };
  updateNote = (e) => {
    const thisNote = e.target.closest("li");

    const updatedPost = {
      title: thisNote.querySelector(".note-title-field").value,
      content: thisNote.querySelector(".note-body-field").value,
    };
    const opts = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
      credentials: "same-origin",
      body: JSON.stringify(updatedPost),
    };

    async function load() {
      const url =
        universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.dataset.id;

      const obj = await (await fetch(url, opts)).json();
      return obj;
    }
    (async () => {
      try {
        const obj = await load();
        this.makeNoteReadOnly(thisNote);
      } catch (e) {
        console.log(e);
      }
    })();
  };
  editNote = (e) => {
    const thisNote = e.target.closest("li");
    if (thisNote.dataset.state == "editable") {
      this.makeNoteReadOnly(thisNote);
    } else {
      this.makeNoteEditable(thisNote);
    }
  };
  makeNoteEditable = (thisNote) => {
    thisNote.querySelector(".edit-note").innerHTML =
      '<i class="fa fa-times" aria-hidden="true"></i> Cancel';

    thisNote.querySelector(".note-title-field").removeAttribute("readonly");
    thisNote.querySelector(".note-body-field").removeAttribute("readonly");
    thisNote
      .querySelector(".note-title-field")
      .classList.add("note-active-field");
    thisNote
      .querySelector(".note-body-field")
      .classList.add("note-active-field");
    thisNote
      .querySelector(".update-note")
      .classList.add("update-note--visible");
    thisNote.dataset.state = "editable";
  };

  makeNoteReadOnly = (thisNote) => {
    thisNote.querySelector(".edit-note").innerHTML =
      '<i class="fa fa-pencil" aria-hidden="true"></i> Edit';

    thisNote
      .querySelector(".note-title-field")
      .setAttribute("readonly", "readonly");
    thisNote
      .querySelector(".note-body-field")
      .setAttribute("readonly", "readonly");
    thisNote
      .querySelector(".note-title-field")
      .classList.remove("note-active-field");
    thisNote
      .querySelector(".note-body-field")
      .classList.remove("note-active-field");
    thisNote
      .querySelector(".update-note")
      .classList.remove("update-note--visible");
    thisNote.dataset.state = "non-editable";
  };

  deleteNote = (e) => {
    const thisNote = e.target.closest("li");
    const opts = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
      credentials: "same-origin",
    };

    async function load() {
      const url =
        universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.dataset.id;
      const obj = await (await fetch(url, opts)).json();
      return obj;
    }
    (async () => {
      try {
        const obj = await load();
        thisNote.style.display = "none";
      } catch (e) {
        console.log(e);
      }
    })();
  };
}
export default myNotes;
