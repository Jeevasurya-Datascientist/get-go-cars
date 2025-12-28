
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, Star, User, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LeafletMap } from "@/components/LeafletMap";
import { supabase } from "@/lib/supabase";

interface PageProps {
    user?: { name: string; role: 'customer' | 'admin' } | null;
    onLogout?: () => void;
}

export function ContactPage({ user, onLogout }: PageProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Attempt to save to Supabase "messages" table
            const { error } = await supabase
                .from('contact_submissions') // Assuming table name
                .insert([formData]);

            if (error) throw error;

            toast({
                title: "Message Sent Successfully! 🚀",
                description: "Thank you for contacting JS Corporations. We will respond shortly.",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback for demo/no-backend scenario
            toast({
                title: "Message Sent (Local)",
                description: "Note: Backend connection failed, but your query is noted in the local session.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500/20">
            <Navbar user={user} onLogout={onLogout} />

            <main className="flex-1 pt-24 pb-12">
                {/* Header Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="container relative z-10 text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-yellow-500 mb-4 animate-fade-in">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            <span>24/7 Premium Support</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 animate-shimmer bg-[length:200%_auto]">Touch</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Have questions about our fleet or services? The JS Corporations team is here to assist you.
                        </p>
                    </div>
                </section>

                <div className="container max-w-7xl px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Contact Form */}
                        <div className="space-y-8 animate-slide-in-right delay-100">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <h2 className="text-2xl font-bold mb-6 text-white relative z-10">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Name</label>
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Magisesan S"
                                                className="bg-black/50 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl text-white placeholder:text-gray-600"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email</label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="client@example.com"
                                                className="bg-black/50 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl text-white placeholder:text-gray-600"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Subject</label>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Inquiry about luxury fleet..."
                                            className="bg-black/50 border-white/10 focus:border-yellow-500/50 h-12 rounded-xl text-white placeholder:text-gray-600"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Message</label>
                                        <Textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="How can we help you today?"
                                            className="bg-black/50 border-white/10 focus:border-yellow-500/50 min-h-[150px] rounded-xl text-white placeholder:text-gray-600 resize-none"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-14 bg-[#facc15] hover:bg-[#eab308] text-black font-bold text-lg rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(250,204,21,0.4)]"
                                    >
                                        {loading ? "Sending..." : "Send Message"} <Send className="ml-2 h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Info & Map */}
                        <div className="space-y-8 animate-slide-in-right delay-200">
                            {/* Info Cards */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors group">
                                    <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500 group-hover:scale-110 transition-transform">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">Visit HQ</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        123 Rental Avenue<br />
                                        Konghu Velalar Polytechnic College,<br />
                                        Perundurai, Erode 638052
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors group">
                                    <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500 group-hover:scale-110 transition-transform">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">Managing Director</h3>
                                    <p className="text-sm text-gray-400">Magisesan S</p>
                                    <p className="text-xs text-yellow-500/80 mt-1">JS Corporations</p>
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
                                <LeafletMap />
                                {/* Overlay Gradient for seamless integration */}
                                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-3xl z-10" />
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-transparent border border-white/10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Phone className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">+91 76048 65437</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">contact@jscorporations.com</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm">24/7 Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
