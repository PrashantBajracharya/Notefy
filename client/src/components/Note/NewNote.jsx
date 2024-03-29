import NoteInput from "./NoteInput.jsx";
import { useRef } from "react";
import SpeechToTextConverter from "../SpeechToTextConverter.jsx";
import errorNotification from "../../utils/notification.js";
import { ToastContainer } from "react-toastify";
import axios from "axios";

function NewNote({onAdd, onCancel}) {
    const title = useRef();
    const description = useRef();
    const dueDate = useRef();
    const cancelButtonRef = useRef();
    const saveButtonRef = useRef();

    function handleCommand(command) {
        const lowerCommand = command.toLowerCase();
        if (lowerCommand.includes('add title')) {
          const titleToAdd = command.replace('add title', '').trim();
          title.current.value = titleToAdd;
        } 

        else if (lowerCommand.includes('remove title')) {
            title.current.value = ""
        }

        else if (lowerCommand.includes('add description')) {
          const descriptionToAdd = command.replace('add description', '').trim();
          description.current.value = descriptionToAdd;
        } 

        else if (lowerCommand.includes('remove description')) {
            description.current.value = "";
          } 

        else if (lowerCommand.includes('cancel')) {
            // Trigger cancel button click
            cancelButtonRef.current.click();
        } 

        else if (lowerCommand.includes('done')) {
            // Trigger cancel button click
            saveButtonRef.current.click();
        } 

      };

    function handleSave(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const formData = Object.fromEntries(fd.entries());
        const enteredTitle = title.current.value;
        const enteredDescription = description.current.value;
        const enteredDueDate = dueDate.current.value;

        if(enteredTitle.trim() === "" || enteredDescription.trim() === "" || enteredDueDate.trim() === "") {
            errorNotification("Enter value for all input fields.");
            return;
        }

        onAdd({
            title: enteredTitle,
            description: enteredDescription,
            dueDate: enteredDueDate
        });

        console.log(sessionStorage.getItem("user"))
        axios
      .post("http://localhost:3000/addnote", formData)
      .catch((error) => {
        console.log(error);
        if (error.response) {
          let errorMessage = error.response.data.message;
          errorNotification(errorMessage);
        } else {
          errorNotification(error.message);
        }
      });
    }

    return(
        <>
            <ToastContainer newestOnTop position="bottom-right" />      
            <form onSubmit={handleSave}>  
                <div className="w-[35rem] mt-16 border-solid border-2 border-stone-400 h-fit p-8 rounded-md">
                    <h1 className="text-4xl font-bold text-center">Add Note</h1>
                    <div>
                        <NoteInput type="hidden" name="addedDate" value={ 
                            new Date().toISOString().slice(0, 10)
                        } />
                        <NoteInput type="text" label="Title" ref={title} name="title" />
                        <NoteInput label="Description" ref={description} textarea name="description"/>
                        <NoteInput type="date" label="Due Date" ref={dueDate} name="dueDate"/>
                    </div>
                    <menu className="flex items-center justify-center gap-4 my-4">
                        <li>
                            <button 
                                className="px-6 py-2 rounded-md bg-red-600 text-stone-100 hover:bg-red-700"
                                ref={cancelButtonRef}
                                onClick={onCancel}>
                                Cancel
                            </button>
                        </li>
                        <SpeechToTextConverter onCommand={handleCommand} className="px-6 py-2 rounded-md bg-blue-600 text-stone-100 hover:bg-blue-700"/>
                        <li>
                            <button                           
                                className="px-6 py-2 rounded-md bg-green-600 text-stone-100 hover:bg-green-700"
                                ref={saveButtonRef}>
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