const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1E40AF] text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rayap Tebu</h3>
            <p className="text-sm">
              Aplikasi untuk melacak pengiriman tebu dari lahan pertanian ke pabrik gula.
              Dilengkapi dengan fitur analisis data dan visualisasi untuk membantu pengambilan keputusan.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-yellow-200 transition-colors">Dashboard</a></li>
              <li><a href="/form" className="hover:text-yellow-200 transition-colors">Input Data</a></li>
              <li><a href="/data" className="hover:text-yellow-200 transition-colors">Tabel Data</a></li>
              <li><a href="/analysis" className="hover:text-yellow-200 transition-colors">Analisis</a></li>
              <li><a href="/settings" className="hover:text-yellow-200 transition-colors">Pengaturan</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <p className="text-sm mb-2">
              Jika Anda memiliki pertanyaan atau masukan, silakan hubungi kami.
            </p>
            <p className="text-sm">
              Email: <a href="mailto:sherlyta.sayang@gmail.com" className="hover:text-yellow-200 transition-colors">sherlyta.sayang@gmail.com</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm">
          <p>&copy; {currentYear} Rayap Tebu. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
