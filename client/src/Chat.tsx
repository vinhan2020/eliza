import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TextResponse } from "@/api";
import { useGetAgentsQuery, useSendMessageMutation } from "@/api";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Chat() {
    const { data: agents } = useGetAgentsQuery();
    const agentId = agents && agents[0].id;
    console.log("agentId", agentId);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<TextResponse[]>([]);
    const [copy, setCopy] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { mutate: sendMessage, isPending } = useSendMessageMutation({
        setMessages,
        setSelectedFile,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!input.trim() && !selectedFile) || !agentId) return;

        // Add user message immediately to state
        const userMessage: TextResponse = {
            text: input,
            user: "user",
            attachments: selectedFile
                ? [
                      {
                          url: URL.createObjectURL(selectedFile),
                          contentType: selectedFile.type,
                          title: selectedFile.name,
                      },
                  ]
                : undefined,
        };
        setMessages((prev) => [...prev, userMessage]);

        sendMessage({ text: input, agentId, selectedFile });
        setInput("");
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="section">
            <Header />
            <div className="chatSection">
                <div className="left">
                    <span className="mainText">AI Virtual Girlfriend</span>

                    <div className="form-chat">
                        {messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div key={index} className={`text-left flex`}>
                                    <p
                                        className={`test ${
                                            message.user === "user"
                                                ? "textUser "
                                                : "textAI"
                                        }`}
                                    >
                                        {message.text}
                                        {message.attachments?.map(
                                            (attachment, i) =>
                                                attachment.contentType.startsWith(
                                                    "image/"
                                                ) && (
                                                    <img
                                                        key={i}
                                                        src={
                                                            message.user ===
                                                            "user"
                                                                ? attachment.url
                                                                : attachment.url.startsWith(
                                                                        "http"
                                                                    )
                                                                  ? attachment.url
                                                                  : `http://localhost:3000/media/generated/${attachment.url.split("/").pop()}`
                                                        }
                                                        alt={
                                                            attachment.title ||
                                                            "Attached image"
                                                        }
                                                        className="mt-2 max-w-full rounded-lg"
                                                    />
                                                )
                                        )}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-muted-foreground">
                                No messages yet. Start a conversation!
                            </div>
                        )}
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex gap-2 formChat"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 inputCus"
                            disabled={isPending}
                        />
                        {/* <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFileSelect}
                    disabled={isPending}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button> */}
                        <Button
                            className="btnSend"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "..." : "➤"}
                        </Button>
                    </form>
                    <div className="btnFooter">
                        <a className="btnTelegram">CHAT ON TELEGRAM!</a>
                        <a className="btnTwitter">FOLLOW TWITTER</a>
                    </div>
                </div>

                {/* {selectedFile && (
                <div className="mt-2 text-sm text-muted-foreground">
                    Selected file: {selectedFile.name}
                </div>
            )} */}
                <div className="right">
                    <div className="gif-box">
                        <img src="/gif.gif"></img>
                    </div>
                </div>
            </div>
            <CopyToClipboard text="N/A" onCopy={() => setCopy(true)}>
                <div className="contractSection">
                    <span
                        className="textContract"
                        style={{ color: copy ? "#4F4C4C" : "#fff" }}
                    >
                        Contract: N/A
                    </span>
                    {copy ? (
                        <>
                            <img className="iconCopy" src="/copied.png"></img>
                            <p style={{ color: "#f53fa1", marginLeft: 5 }}>
                                Copied
                            </p>
                        </>
                    ) : (
                        <img className="iconCopy" src="/copy.png"></img>
                    )}
                </div>
            </CopyToClipboard>
        </div>
    );
}
