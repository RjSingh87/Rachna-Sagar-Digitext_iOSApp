import { StyleSheet, Text, TouchableOpacity, View, Alert, Platform, Modal, Image, ActivityIndicator, ProgressViewIOS, Button, FlatList, Dimensions, RefreshControl, Clipboard, } from 'react-native'
import React, { useEffect, useState, useCallback, memo, useContext } from 'react'
import { apiRoutes, rsplTheme, token } from '../constant';
import Header from '../comman/Header';
import { useNavigation } from '@react-navigation/native';
import Services from '../services';
import Loader from '../constant/Loader';
import { MyContext } from '../Store';
import { unzipSync } from "fflate";
import { Buffer } from "buffer"; // Buffer is required
import RNBlobUtil from "react-native-blob-util";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Store extracted file path


const { width, height } = Dimensions.get("window")

const EbookList = () => {
  const navigation = useNavigation()
  const { userData } = useContext(MyContext)
  const [eBookDataList, setEbookDataList] = useState({ data: [], loaderStatus: false, message: "" })
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);



  useEffect(() => {
    eBookListing()
  }, [])
  const onRefresh = useCallback(() => {
    setEbookDataList((prev) => { return { ...prev, loaderStatus: true } })
    setTimeout(() => {
      eBookListing()
      setEbookDataList((prev) => { return { ...prev, loaderStatus: false } })
    }, 1000);
  }, [eBookDataList.loaderStatus])

  const eBookListing = async () => {
    setEbookDataList((prev) => { return { ...prev, loaderStatus: true } }) // for loader true
    const payload = {
      "api_token": token,
      "userid": userData.data[0]?.id // when user logging successfully then get userID dynamically.
    }
    await Services.post(apiRoutes.eBookList, payload)
      .then((res) => {
        if (res.status === "success" && res.data.length != 0) {
          setEbookDataList((prev) => { return { ...prev, data: res.data, loaderStatus: true } })
        } else if (res.success == "error" || res.status == "error") {
          if (userData.isLogin) {
            setEbookDataList((prev) => { return { ...prev, message: res.message } })
          } else {
            setEbookDataList((prev) => { return { ...prev, message: "Please login." } })
          }
        }
      })
      .catch((err) => {
        if (err.message == "TypeError: Network request failed") {
          Alert.alert("Network Error", `Please try again.`)
        } else { Alert.alert("Error", `${err.message}`) }
      })
      .finally(() => { setEbookDataList((prev) => { return { ...prev, loaderStatus: false } }) })

  }

  if (eBookDataList.loaderStatus) {
    return (
      <View style={styles.loader}>
        <Loader text='Loading...' />
      </View>
    )
  }


  const eBookRenderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={(() => { downloadAndExtractZip(item) })} key={item.id} style={styles.productItem}>
        <Image style={styles.eBookImage} source={{ uri: item?.productData?.url }} />
        <Text style={styles.eBookTitleName} numberOfLines={2}>{item?.productData?.product_title}</Text>
      </TouchableOpacity>
    )
  }


  const pdfViewer = (pdfUrl) => {
    navigation.navigate("PdfViewerPasswordProtected", { pdfUrl: pdfUrl })
    return
    navigation.navigate("PdfViewer", { bookid: bookid })
  }


  // async function downloadAndExtractZip(item) {
  //   setIsLoading(true)
  //   try {
  //     const zipUrl = item?.eBookUrl?.download_link;
  //     const zipPath = `${RNBlobUtil.fs.dirs.DocumentDir}/downloaded.zip`;

  //     // ✅ Check if PDF already extracted
  //     const savedPdfPath = await AsyncStorage.getItem(zipUrl);
  //     if (savedPdfPath) {
  //       console.log("✅ PDF already extracted, opening directly:", savedPdfPath);
  //       navigation.navigate("PdfViewerPasswordProtected", { pdfUrl: savedPdfPath });
  //       return;
  //     }

  //     console.log(`📥 Downloading ZIP from: ${zipUrl}`);
  //     const res = await RNBlobUtil.config({ path: zipPath }).fetch("GET", zipUrl);
  //     console.log(`✅ ZIP downloaded at: ${zipPath}`);

  //     const fileExists = await RNBlobUtil.fs.exists(zipPath);
  //     if (!fileExists) throw new Error("❌ ZIP file not found!");

  //     // ✅ Read ZIP as Base64
  //     const base64Data = await RNBlobUtil.fs.readFile(zipPath, "base64");

  //     if (!base64Data) throw new Error("❌ base64Data is empty!");

  //     // ✅ Convert base64 to Uint8Array
  //     const zipData = new Uint8Array(Buffer.from(base64Data, "base64"));
  //     console.log("✅ ZIP data converted to Uint8Array:", zipData.length);

  //     // ✅ Extract ZIP contents
  //     const extractedFiles = unzipSync(zipData);
  //     console.log("✅ Files extracted:", Object.keys(extractedFiles));

  //     let pdfUrl = null;

  //     for (const fileName of Object.keys(extractedFiles)) {
  //       if (fileName.endsWith(".pdf")) {
  //         pdfUrl = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
  //         const fileContent = extractedFiles[fileName];

  //         // ✅ Correct encoding & save as base64
  //         await RNBlobUtil.fs.writeFile(pdfUrl, Buffer.from(fileContent).toString("base64"), "base64");
  //         console.log(`✅ Extracted PDF saved at: ${pdfUrl}`);

  //         // ✅ Save extracted PDF path to AsyncStorage
  //         await AsyncStorage.setItem(zipUrl, pdfUrl);
  //         break;
  //       }
  //     }

  //     if (!pdfUrl) throw new Error("❌ No PDF found in ZIP!");

  //     console.log("✅ ZIP Extraction Complete!");
  //     navigation.navigate("PdfViewerPasswordProtected", { pdfUrl });
  //     setIsLoading(false)
  //   } catch (error) {
  //     setIsLoading(false)
  //     console.error("❌ Error extracting ZIP:", error);
  //   }
  // }

  async function downloadAndExtractZip(item) {
    try {
      const zipUrl = item?.eBookUrl?.download_link;
      const pdfPsw = item?.eBookUrl?.psw;
      const pdfTitle = item?.productData?.product_title;
      const zipPath = `${RNBlobUtil.fs.dirs.DocumentDir}/downloaded.zip`;

      // ✅ Check if already extracted
      const savedPdfPath = await AsyncStorage.getItem(zipUrl);
      if (savedPdfPath) {
        navigation.navigate("PdfViewerPasswordProtected", { pdfUrl: savedPdfPath, pdfPsw: pdfPsw, pdfTitle: pdfTitle });
        return;
      }

      // Start Loader Only for New Download
      setLoading(true);
      setProgress(0);


      // ✅ Correct way to track progress
      const res = await RNBlobUtil.config({ path: zipPath, fileCache: true })
        .fetch("GET", zipUrl)
        .progress({ interval: 250 }, (received, total) => {
          let percentage = Math.round((received / total) * 100);
          setProgress(percentage);  // 📌 Directly updating progress
        });


      const fileExists = await RNBlobUtil.fs.exists(zipPath);
      if (!fileExists) throw new Error("❌ ZIP file not found!");

      const base64Data = await RNBlobUtil.fs.readFile(zipPath, "base64");
      if (!base64Data) throw new Error("❌ base64Data is empty!");

      const zipData = new Uint8Array(Buffer.from(base64Data, "base64"));

      const extractedFiles = unzipSync(zipData);

      let pdfUrl = null;
      let totalFiles = Object.keys(extractedFiles).length;
      let processedFiles = 0;

      for (const fileName of Object.keys(extractedFiles)) {
        if (fileName.endsWith(".pdf")) {
          pdfUrl = `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`;
          const fileContent = extractedFiles[fileName];

          await RNBlobUtil.fs.writeFile(pdfUrl, Buffer.from(fileContent).toString("base64"), "base64");


          await AsyncStorage.setItem(zipUrl, pdfUrl);
        }
        processedFiles++;
        setProgress(50 + Math.round((processedFiles / totalFiles) * 50)); // 📌 Extraction progress
      }

      if (!pdfUrl) throw new Error("❌ No PDF found in ZIP!");


      setTimeout(() => {
        setLoading(false);
        setProgress(100); // ✅ Ensure progress is full at end
        navigation.navigate("PdfViewerPasswordProtected", { pdfUrl, pdfPsw, pdfTitle });
      }, 500);

    } catch (error) {
      console.error("❌ Error extracting ZIP:", error);
      setLoading(false);
    }
  }







  return (
    <View sltye={styles.mainContainer}>
      <Header
        leftIcon={require("../assets/icons/backArrow.png")}
        // rightIcon={require('../assets/icons/shopping-cart.png')}
        title={"Ebook"}
        onClickLeftIcon={() => { navigation.goBack(); }}
        onClickRightIcon={() => { return }}
      />




      <View style={styles.listContainer}>
        {eBookDataList.data.length ?
          <FlatList
            data={eBookDataList?.data}
            renderItem={eBookRenderItem}
            // keyExtractor={(item, index) => { index.toString() }}
            numColumns={2} // Display 2 items in a row
            onEndReachedThreshold={0.1} // Trigger onEndReached when the end is reached at 90% of the list
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={eBookDataList.loaderStatus}
                onRefresh={onRefresh}
              />
            }
          /> :
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: rsplTheme.rsplRed }} >{eBookDataList.message}</Text>
          </View>


        }

      </View>

      {loading && (
        <Modal transparent={true} visible={true}>
          <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"
          }}>
            <View style={{
              backgroundColor: "white", padding: 20, borderRadius: 10
            }}>
              <ActivityIndicator size="large" color={rsplTheme.rsplRed} />
              <Text style={{ marginTop: 10, fontSize: 16 }}>Downloading... {progress}%</Text>
            </View>
          </View>
        </Modal>
      )}

    </View>
  )
}

export default EbookList

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: rsplTheme.rsplWhite
  },
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  listContainer: {
    // flex: 1,
    padding: 8,
    height: height - 132,
    // marginBottom: "25%",
    backgroundColor: rsplTheme.rsplWhite
  },
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: rsplTheme.rsplLightGrey,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
  },
  eBookImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  eBookTitleName: {
    fontSize: 14,
    fontWeight: "500",
    color: rsplTheme.textColorBold,
    textAlign: "center",
    marginVertical: 10,
  }
})