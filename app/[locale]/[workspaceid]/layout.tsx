// 全てクライアント側で動かす(all動的?)
"use client"

// from のモジュールから importの要素を利用できるようにする
import { Dashboard } from "@/components/ui/dashboard"
import { ChatbotUIContext } from "@/context/context"
import { getAssistantWorkspacesByWorkspaceId } from "@/db/assistants"
import { getChatsByWorkspaceId } from "@/db/chats"
import { getCollectionWorkspacesByWorkspaceId } from "@/db/collections"
import { getFileWorkspacesByWorkspaceId } from "@/db/files"
import { getFoldersByWorkspaceId } from "@/db/folders"
import { getModelWorkspacesByWorkspaceId } from "@/db/models"
import { getPresetWorkspacesByWorkspaceId } from "@/db/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/db/prompts"
import { getAssistantImageFromStorage } from "@/db/storage/assistant-images"
import { getToolWorkspacesByWorkspaceId } from "@/db/tools"
import { getWorkspaceById } from "@/db/workspaces"
import { convertBlobToBase64 } from "@/lib/blob-to-b64"
import { supabase } from "@/lib/supabase/browser-client"
import { LLMID } from "@/types"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useContext, useEffect, useState } from "react"
import Loading from "../loading"


// interfaceは型定義。childrenはReactNode型のみを受け入れる
// ReactNodeはほぼすべてを受け入れる相当柔軟な型定義
interface WorkspaceLayoutProps {
  children: ReactNode
}
// exportは外部利用できるよ
// defaultは初期設定
//引数childrenで、WorkspaceLayoutProps型
export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  //ルーティングを簡単に設定するためのもの
  const router = useRouter()
  // idの取得
  const params = useParams()
  // パラメータを取得
  const searchParams = useSearchParams()
  //文字列にして
  const workspaceId = params.workspaceid as string
  // 値を変更できる奴を読み込んでる？
  const {
    setChatSettings,
    setAssistants,
    setAssistantImages,
    setChats,
    setCollections,
    setFolders,
    setFiles,
    setPresets,
    setPrompts,
    setTools,
    setModels,
    selectedWorkspace,
    setSelectedWorkspace,
    setSelectedChat,
    setChatMessages,
    setUserInput,
    setIsGenerating,
    setFirstTokenReceived,
    setChatFiles,
    setChatImages,
    setNewMessageFiles,
    setNewMessageImages,
    setShowFilesDisplay
  } = useContext(ChatbotUIContext)
  // 初期値true のusestate
  const [loading, setLoading] = useState(true)

  //レンダリング後に実行される 
  useEffect(() => {
    ;(async () => {
      //supabaseからセッション情報を取得(非同期)
      const session = (await supabase.auth.getSession()).data.session
      // セッションが存在しないなら
      if (!session) {
        // loginにナビゲートする
        return router.push("/login")
      } else {
        await fetchWorkspaceData(workspaceId)
      }
    })()
  }, [])

  //レンダリング後にworkspaceIdに変更があれば実行される 初期化 
  useEffect(() => {
    ;(async () => await fetchWorkspaceData(workspaceId))()

    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)

    setIsGenerating(false)
    setFirstTokenReceived(false)

    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
  }, [workspaceId])

  const fetchWorkspaceData = async (workspaceId: string) => {
    setLoading(true)
    // workspaceidと同じidのワークスペースを取り出しselectedWorkspaceにセット
    const workspace = await getWorkspaceById(workspaceId)
    setSelectedWorkspace(workspace)
    //workspaceidと同じidのワークスペースのid,name,assistantを取得しアシスタントをセット
    const assistantData = await getAssistantWorkspacesByWorkspaceId(workspaceId)
    setAssistants(assistantData.assistants)
    // assistantが複数あるのか？データ構造があんまりわかってない
    for (const assistant of assistantData.assistants) {
      let url = ""
      // アシスタントにimage_pathがあるなら24時間有効なURLを変数に入れる
      if (assistant.image_path) {
        url = (await getAssistantImageFromStorage(assistant.image_path)) || ""
      }
      
      if (url) {
        // urlからデータを取得して(?)、Base64に変換 blobは読み取り専用データ base64はデータを文字列にする際に使う規格
        const response = await fetch(url)
        const blob = await response.blob()
        const base64 = await convertBlobToBase64(blob)
        // AssistantImagesにassistantId path base64 urlを足してセット
        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64,
            url
          }
        ])
      } else {
        setAssistantImages(prev => [
          ...prev,
          {
            assistantId: assistant.id,
            path: assistant.image_path,
            base64: "",
            url
          }
        ])
      }
    }

    // 新しくなったworkspaceIdでセットし直し

    const chats = await getChatsByWorkspaceId(workspaceId)
    setChats(chats)

    const collectionData =
      await getCollectionWorkspacesByWorkspaceId(workspaceId)
    setCollections(collectionData.collections)

    const folders = await getFoldersByWorkspaceId(workspaceId)
    setFolders(folders)

    const fileData = await getFileWorkspacesByWorkspaceId(workspaceId)
    setFiles(fileData.files)

    const presetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
    setPresets(presetData.presets)

    const promptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
    setPrompts(promptData.prompts)

    const toolData = await getToolWorkspacesByWorkspaceId(workspaceId)
    setTools(toolData.tools)

    const modelData = await getModelWorkspacesByWorkspaceId(workspaceId)
    setModels(modelData.models)

    setChatSettings({
      model: (searchParams.get("model") ||
        workspace?.default_model ||
        "gpt-4-1106-preview") as LLMID,
      prompt:
        workspace?.default_prompt ||
        "You are a friendly, helpful AI assistant.",
      temperature: workspace?.default_temperature || 0.5,
      contextLength: workspace?.default_context_length || 4096,
      includeProfileContext: workspace?.include_profile_context || true,
      includeWorkspaceInstructions:
        workspace?.include_workspace_instructions || true,
      embeddingsProvider:
        (workspace?.embeddings_provider as "openai" | "local") || "openai"
    })

    setLoading(false)
  }

  if (loading) {
    return <Loading />
  }
  // Dashboardにchildrenを渡して出力
  return <Dashboard>{children}</Dashboard>
}
