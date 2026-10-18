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
            string rawName = txtFullName.Text.Trim();
            string cleanName = Regex.Replace(rawName, @"\s+", " ");

            if (string.IsNullOrEmpty(cleanName))
            {
                txtError.Visibility = Visibility.Visible;
                txtFullName.Focus();
                return;
            }

            Window targetWindow;

            if (radNam.IsChecked == true)
            {
                targetWindow = new Window_Nam(cleanName);
            }
            else
            {
                string nameLower = cleanName.ToLower();

                switch (nameLower)
                {
                    // 1. PHAN NGỌC TƯỜNG VY (Chỉnh sửa tên tại dòng case bên dưới)
                    case "phan ngọc tường vy":
                        targetWindow = new Window_TuongVy();
                        break;

                    case "nguyễn hữu ngọc ngân":
                        targetWindow = new Window_NgocNgan();
                        break;

                    case "lê nguyễn khánh băng":
                        targetWindow = new Window_KhanhBang();
                        break;

                    case "nguyễn phúc đoan trang":
                        targetWindow = new Window_DoanTrang();
                        break;

                    default:
                        targetWindow = new Window_NuKhac(cleanName);
                        break;
                }
            }

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