import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
//import {ChatbotUIContext} from "@/context/context"
//import {createFolder} from "@/db/folders"
import { ContentType } from "@/types"
import {
  //IconFolderPlus,
  IconPlus
} from "@tabler/icons-react"
import {
  FC
  //useContext,
  //useState
} from "react"
import { Button } from "../ui/button"
//import {CreateAssistant} from "./items/assistants/create-assistant"
//import {CreateCollection} from "./items/collections/create-collection"
//import {CreateFile} from "./items/files/create-file"
//import {CreateModel} from "./items/models/create-model"
//import {CreatePreset} from "./items/presets/create-preset"
//import {CreatePrompt} from "./items/prompts/create-prompt"
//import {CreateTool} from "./items/tools/create-tool"

interface SidebarCreateButtonsProps {
  contentType: ContentType
  hasData: boolean
}

export const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({
  contentType
  //hasData
}) => {
  //const {profile, selectedWorkspace, folders, setFolders} =
  //  useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()

  //const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  //const [isCreatingPreset, setIsCreatingPreset] = useState(false)
  //const [isCreatingFile, setIsCreatingFile] = useState(false)
  //const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  //const [isCreatingAssistant, setIsCreatingAssistant] = useState(false)
  //const [isCreatingTool, setIsCreatingTool] = useState(false)
  //const [isCreatingModel, setIsCreatingModel] = useState(false)

  //const handleCreateFolder = async () => {
  //  if (!profile) return
  //  if (!selectedWorkspace) return

  //  const createdFolder = await createFolder({
  //    user_id: profile.user_id,
  //    workspace_id: selectedWorkspace.id,
  //    name: "New Folder",
  //    description: "",
  //    type: contentType
  //  })
  //  setFolders([...folders, createdFolder])
  //}

  const getCreateFunction = () => {
    switch (contentType) {
      case "chats":
        return async () => {
          handleNewChat()
        }

      //    case "presets":
      //      return async () => {
      //        setIsCreatingPreset(true)
      //      }

      //    case "prompts":
      //      return async () => {
      //        setIsCreatingPrompt(true)
      //      }

      //    case "files":
      //      return async () => {
      //        setIsCreatingFile(true)
      //      }

      //    case "collections":
      //      return async () => {
      //        setIsCreatingCollection(true)
      //      }

      //    case "assistants":
      //      return async () => {
      //        setIsCreatingAssistant(true)
      //      }

      //    case "tools":
      //      return async () => {
      //        setIsCreatingTool(true)
      //      }

      //    case "models":
      //      return async () => {
      //        setIsCreatingModel(true)
      //      }

      default:
        break
    }
  }
  /* ここでボタン文字を変更してるのはわかったけど、chatはどこ？ */
  return (
    <div className="flex w-full space-x-2">
      <Button
        className="flex h-[48px] grow items-center justify-between rounded-md px-4 text-[16px] text-[#222222] shadow-md"
        style={{
          backgroundColor: "rgba(217, 217, 217, 0.3)",
          boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.15)"
        }}
        onClick={getCreateFunction()}
      >
        新規{" "}
        {contentType.charAt(0).toUpperCase() +
          contentType.slice(1, contentType.length - 1)}
        <IconPlus className="mr-1" size={20} />
      </Button>

      {/*hasData && (
        <Button className="size-[36px] p-1" onClick={handleCreateFolder}>
          <IconFolderPlus size={20} />
        </Button>
      )*/}

      {/*isCreatingPrompt && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={setIsCreatingPrompt}
        />
      )*/}

      {/*isCreatingPreset && (
        <CreatePreset
          isOpen={isCreatingPreset}
          onOpenChange={setIsCreatingPreset}
        />
      )*/}

      {/*isCreatingFile && (
        <CreateFile isOpen={isCreatingFile} onOpenChange={setIsCreatingFile} />
      )*/}

      {/*isCreatingCollection && (
        <CreateCollection
          isOpen={isCreatingCollection}
          onOpenChange={setIsCreatingCollection}
        />
      )*/}

      {/*isCreatingAssistant && (
        <CreateAssistant
          isOpen={isCreatingAssistant}
          onOpenChange={setIsCreatingAssistant}
        />
      )*/}

      {/*isCreatingTool && (
        <CreateTool isOpen={isCreatingTool} onOpenChange={setIsCreatingTool} />
      )*/}

      {/*isCreatingModel && (
        <CreateModel
          isOpen={isCreatingModel}
          onOpenChange={setIsCreatingModel}
        />
      )*/}
    </div>
  )
}
