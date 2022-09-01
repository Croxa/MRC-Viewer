# MRC Preview in VSCode

Simple preview for MRC (`.mrc`) files in VSCode. The extension replicates the same image pan and zoom behaviour as VSCode's built-in Image Editor by mostly using code from the Tiff-Preview extension. Like the Image Editor, the status bar is used to report the size of the file on disk, the image dimensions in pixels, the current zoom level and additionally the slice number (for tomograms).


## Usage

### **Click**

To preview a file:

- Click on a (`.mrc`, `.mrcs`, `.rec`) file 

A preview of the file contents should now be shown in an editor.

### **Open to the Side**

To preview a file in a new editor (if other editors are already open):

- Right-click on a file with (`.mrc`, `.mrcs`, `.rec`) extension and choose *Open to the Side*

A preview of the file contents should now be shown in a new editor.

### **Open With...**

To choose how to view a MRC file:

- Right-click on a file with (`.mrc`, `.mrcs`, `.rec`) extension and choose *Open With...*
- A list of available options appears in the Command Palette, choose one of the options which will include:

    > *MRC Preview*, the viewer provided by this extension. Choose this option to preview the file.

### **Zoom** 

You can control the zoom level of the image:

- Click in the editor to zoom in, or shift-click (Windows)  option-click (macOS) to zoom out. The current zoom level is shown in the status bar.
  
- Click on the zoom level in the status bar to reveal a selection list in the Command Palette. Choose the desired zoom level from the list.

### **Slice**
You can scroll through the slices of tomograms by scrolling with alt pressed. The image will be updated after scrolling stops.
