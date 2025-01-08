<CsoundSynthesizer>
<CsOptions>
-odac
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1

instr 1
  iamp = p4
  ifreq = p5
  
  a1 = poscil(iamp, ifreq)
  a2 = poscil(iamp, ifreq * 1.5)
  a3 = poscil(iamp, ifreq * 2)
  
  aout = (a1 + a2 + a3) * 0.3
  outs aout, aout
endin

</CsInstruments>
<CsScore>
f 0 3600
e
</CsScore>
</CsoundSynthesizer>

