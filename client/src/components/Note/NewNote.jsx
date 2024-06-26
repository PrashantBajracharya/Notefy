import NoteInput from "./NoteInput.jsx";
import { useRef } from "react";
import SpeechToTextConverter from "../../utils/SpeechToTextConverter.jsx";
import errorNotification from "../../utils/notification.js";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { notesActions } from "../../store/notesSlice.js";

function NewNote() {
  const title = useRef();
  const description = useRef();
  const dueDate = useRef();
  const cancelButtonRef = useRef();
  const saveButtonRef = useRef();
  const userId = useSelector((state) => state.user.userId);
  const accessToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  

  function handleCommand(command) {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes("add title")) {
      const titleToAdd = command.replace("add title", "").trim();
      title.current.value = titleToAdd;
    } else if (lowerCommand.includes("remove title")) {
      title.current.value = "";
    } else if (lowerCommand.includes("add description")) {
      const descriptionToAdd = command.replace("add description", "").trim();
      description.current.value = descriptionToAdd;
    } else if (lowerCommand.includes("remove description")) {
      description.current.value = "";
    } else if (lowerCommand.includes("add date")) {
      const dateToAdd = lowerCommand.replace("add date", "").trim();
      const formattedDate = formatDate(dateToAdd);
      if (formattedDate) {
        dueDate.current.value = formattedDate;
      } else {
        console.error("Invalid date format provided.");
      }
    } else if (lowerCommand.includes("remove date")) {
      dueDate.current.value=""
    }else if (lowerCommand.includes("cancel")) {
      cancelButtonRef.current.click();
    } else if (lowerCommand.includes("save")) {
      saveButtonRef.current.click();
    }
  }

  function formatDate(dateString) {
    const parts = dateString.split(" ");
    if (parts.length === 2) {
      const year = parts[0];
      const month = parts[1].substring(0, 2);
      const day = parts[1].substring(2);
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  function handleSave(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const formData = Object.fromEntries(fd.entries());
    formData.userId = userId;
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = dueDate.current.value;

    if (
      enteredTitle.trim() === "" ||
      enteredDescription.trim() === "" ||
      enteredDueDate.trim() === ""
    ) {
      errorNotification("Enter value for all input fields.");
      return;
    }

    axios
      .post("http://localhost:3000/addnote", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((error) => {
        if (error.response) {
          let errorMessage = error.response.data.message;
          errorNotification(errorMessage);
        } else {
          errorNotification(error.message);
        }
      });
    dispatch(notesActions.setNoteId(undefined));
  }

  function onCancel() {
    dispatch(notesActions.setNoteId(undefined));
  }

  return (
    <>
      <ToastContainer newestOnTop position="bottom-right" />
      <form onSubmit={handleSave}>
        <div className="w-[35rem] mt-16 bg-yellow-100 border-2 border-yellow-800 h-fit p-8 rounded-md">
          <h1 className="text-4xl font-bold text-center">Add Note</h1>
          <div>
            <NoteInput
              type="hidden"
              name="addedDate"
              value={new Date().toISOString().slice(0, 10)}
            />
            <NoteInput
              type="text"
              label="Title"
              ref={title}
              name="title"
              placeholder="Add a title."
            />
            <NoteInput
              label="Description"
              ref={description}
              textarea
              name="description"
              placeholder="Add a description."
            />
            <NoteInput
              type="date"
              label="Due Date"
              ref={dueDate}
              name="dueDate"
            />
          </div>
          <menu className="flex items-center justify-center gap-4 my-4">
            <li>
              <button
                type="button"
                className="px-6 py-2 rounded-md bg-red-600 text-stone-100 hover:bg-red-700"
                ref={cancelButtonRef}
                onClick={onCancel}
              >
                Cancel
              </button>
            </li>
            <SpeechToTextConverter
              type="button"
              onCommand={handleCommand}
              className="px-6 py-2 rounded-md bg-blue-600 text-stone-100 hover:bg-blue-700"
            />
            <li>
              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-green-600 text-stone-100 hover:bg-green-700"
                ref={saveButtonRef}
              >
                Save
              </button>
            </li>
          </menu>
        </div>
      </form>
    </>
  );
}

export default NewNote;
