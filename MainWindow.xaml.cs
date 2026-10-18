using System;
using System.Text.RegularExpressions;
using System.Windows;
using System.Windows.Input;

namespace ChucMung20_10
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            txtFullName.Focus();
        }

        private void BtnConfirm_Click(object sender, RoutedEventArgs e)
        {
            // Lấy tên người dùng nhập và xóa các khoảng trắng thừa ở giữa/hai đầu
            string rawName = txtFullName.Text.Trim();
            string cleanName = Regex.Replace(rawName, @"\s+", " ");

            if (string.IsNullOrEmpty(cleanName))
            {
                txtError.Visibility = Visibility.Visible;
                txtFullName.Focus();
                return;
            }

            Window targetWindow;

            // ====================================================================
            // BƯỚC 1: KIỂM TRA GIỚI TÍNH NAM HAY NỮ
            // ====================================================================
            if (radNam.IsChecked == true)
            {
                // Nếu chọn Nam -> Mở ngay giao diện dành cho Nam
                targetWindow = new Window_Nam(cleanName);
            }
            else
            {
                // Nếu chọn Nữ -> Kiểm tra tên (Chuyển về chữ thường để nhập hoa/thường đều nhận)
                string nameLower = cleanName.ToLower();

                // ================================================================
                // BƯỚC 2: NƠI SỬA TÊN, THÊM TÊN, XÓA TÊN TRONG DANH SÁCH NỮ
                // - Mẹo: Bạn có thể viết cả Họ Tên đầy đủ hoặc chỉ viết Tên ngắn gọn
                // ================================================================
                switch (nameLower)
                {
                    // 1. PHAN NGỌC TƯỜNG VY (Chỉnh sửa tên tại dòng case bên dưới)
                    case "phan ngọc tường vy":
                        targetWindow = new Window_TuongVy();
                        break;

                    // 2. NGUYỄN HỮU NGỌC NGÂN (Chỉnh sửa tên tại dòng case bên dưới)
                    case "nguyễn hữu ngọc ngân":
                        targetWindow = new Window_NgocNgan();
                        break;

                    // 3. LÊ NGUYỄN KHÁNH BĂNG (Chỉnh sửa tên tại dòng case bên dưới)
                    case "lê nguyễn khánh băng":
                        targetWindow = new Window_KhanhBang();
                        break;

                    // 4. NGUYỄN PHÚC ĐOAN TRANG (Chỉnh sửa tên tại dòng case bên dưới)
                    case "nguyễn phúc đoan trang":
                        targetWindow = new Window_DoanTrang();
                        break;

                    // ============================================================
                    // BƯỚC 3: NẾU LÀ NỮ NHƯNG KHÔNG CÓ TRONG DANH SÁCH TRÊN
                    // ============================================================
                    default:
                        targetWindow = new Window_NuKhac(cleanName);
                        break;
                }
            }

            // Mở giao diện tương ứng và đóng màn hình nhập tên
            targetWindow.Show();
            this.Close();
        }

        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            txtFullName.Clear();
            radNu.IsChecked = true;
            txtError.Visibility = Visibility.Hidden;
            txtFullName.Focus();
        }

        private void TxtFullName_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                BtnConfirm_Click(sender, e);
            }
        }
    }
}